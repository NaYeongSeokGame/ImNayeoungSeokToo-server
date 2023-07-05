import { Request, Response } from 'express';
import fs from 'fs';
import { Types } from 'mongoose';

import ModelQuiz from '@/models/quiz/quiz';
import ModelQuizPreset from '@/models/quizPreset/quizPreset';
import S3StorageModule from '@/modules/s3Storage.module';
import {
  DeleteQuizPresetReqQueryType,
  GetQuizPresetListReqQueryType,
  PostCreateQuizPresetReqBodyType,
} from '@/type/controllers/quizControllers';
import { BadRequestError } from '@/utils/definedErrors';

class QuizController {
  /**
   * 특정 프리셋 PIN 넘버에 맞는 데이터를 반환하는 함수 getQuizPreset
   */
  static async getQuizPreset(req: Request, res: Response) {
    const { presetPin } = req.query;

    if (!presetPin)
      throw new BadRequestError('요청에 담긴 프리셋 PIN 이 없습니다.');

    if (typeof presetPin !== 'string')
      throw new BadRequestError('유효하지 않은 프리셋 PIN 번호입니다.');

    const presetData = await ModelQuizPreset.getQuizPresetById(presetPin);
    const quizList = await ModelQuiz.getQuizListInPreset(presetData.presetPin);

    if (!presetData)
      throw new BadRequestError('해당 PIN 번호를 가진 프리셋이 없습니다.');

    return res.status(200).json({ ...presetData, quizList });
  }
  /**
   * 페이지네이션을 기반으로 프리셋 목록을 전달하는 함수 getQuizPresetList
   */
  static async getQuizPresetList(
    req: Request<unknown, unknown, unknown, GetQuizPresetListReqQueryType>,
    res: Response,
  ) {
    const { page = '1', limit = '9' } = req.query;

    const presetListData = await ModelQuizPreset.getQuizPreset({
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json(presetListData);
  }
  /**
   * 새로운 퀴즈 프리셋을 생성하는 함수 postCreateQuizPreset
   */
  static async postCreateQuizPreset(
    req: Request<unknown, unknown, PostCreateQuizPresetReqBodyType>,
    res: Response,
  ) {
    const imageFiles = req.files as Express.Multer.File[] | undefined;

    if (!imageFiles || !imageFiles.length)
      throw new BadRequestError('요청으로 보낸 이미지 파일이 없습니다.');

    if (Array.isArray(imageFiles) && imageFiles.length > 9)
      throw new BadRequestError(
        '하나의 프리셋에 퀴즈는 최대 9개까지 가능합니다.',
      );

    const { isPrivate = false, title, answers } = req.body;

    if (!title)
      throw new BadRequestError('프리셋에 이름은 꼭 지어주셔야 합니다.');

    const createdQuizPresetPin = await ModelQuizPreset.createQuizPreset({
      isPrivate,
      title,
    });

    const answerList = answers;
    await Promise.all(
      imageFiles.map(async (imageFile, index) => {
        const imageUrl = await S3StorageModule.uploadFileToS3({
          fileData: imageFile,
          presetPin: createdQuizPresetPin,
        });
        const answer = answerList[index];
        await ModelQuiz.createQuizPreset({
          imageUrl,
          answer,
          includedPresetPin: createdQuizPresetPin,
        });
        fs.unlinkSync(imageFile.path);
      }),
    );

    return res.status(200).json({ presetPin: createdQuizPresetPin });
  }

  static async deleteQuizPreset(
    req: Request<unknown, unknown, unknown, DeleteQuizPresetReqQueryType>,
    res: Response,
  ) {
    const { presetPin } = req.query;

    if (!presetPin)
      throw new BadRequestError('요청에 프리셋 PIN 번호가 없습니다.');

    const quizList = await ModelQuiz.getQuizListInPreset(presetPin);

    await Promise.all(
      quizList.map(
        async ({
          _id,
          imageUrl,
        }: {
          _id: Types.ObjectId;
          imageUrl: string;
        }) => {
          await ModelQuiz.deleteQuiz(_id.toString());
          await S3StorageModule.deleteFileFromS3(imageUrl);
        },
      ),
    );

    await ModelQuizPreset.deleteQuizPreset(presetPin);

    return res.sendStatus(200);
  }
}

export default QuizController;
