import { Request, Response } from 'express';
import fs from 'fs';

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

    if (!presetData)
      throw new BadRequestError('해당 PIN 번호를 가진 프리셋이 없습니다.');

    const quizList = await ModelQuiz.getQuizListInPreset(presetPin);

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

    if (Number.isNaN(page) || Number.isNaN(limit))
      throw new BadRequestError(
        'page 혹은 limit 값은 반드시 유효한 숫자여야 합니다.',
      );

    const [pageNum, limitNum] = [page, limit].map(Number);

    if (pageNum <= 0 || limitNum <= 0)
      throw new BadRequestError('page 및 limit 값은 반드시 양수여야 합니다.');

    const presetListData = await ModelQuizPreset.getQuizPreset({
      page: pageNum,
      limit: limitNum,
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

    await Promise.all(
      imageFiles.map(async (imageFile, index) => {
        const imageUrl = await S3StorageModule.uploadFileToS3({
          fileData: imageFile,
          presetPin: createdQuizPresetPin,
        });
        const currentIndexAnswer = answers[index];
        await ModelQuiz.createQuizPreset({
          imageUrl,
          answer: currentIndexAnswer,
          includedPresetPin: createdQuizPresetPin,
        });
        fs.unlinkSync(imageFile.path);
      }),
    );

    return res.status(200).json({ presetPin: createdQuizPresetPin });
  }

  /**
   * 기존의 프리셋을 삭제하는 함수 deleteQuizPreset
   */
  static async deleteQuizPreset(
    req: Request<unknown, unknown, unknown, DeleteQuizPresetReqQueryType>,
    res: Response,
  ) {
    const { presetPin } = req.query;

    if (!presetPin)
      throw new BadRequestError('요청에 프리셋 PIN 번호가 없습니다.');

    const quizList = await ModelQuiz.getQuizListInPreset(presetPin);

    await Promise.all(
      quizList.map(async ({ imageUrl }) => {
        await S3StorageModule.deleteFileFromS3(imageUrl);
      }),
    );

    await ModelQuiz.deleteQuizInPreset(presetPin);
    await ModelQuizPreset.deleteQuizPreset(presetPin);

    return res.sendStatus(200);
  }
}

export default QuizController;
