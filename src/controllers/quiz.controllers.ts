import { NextFunction, Request, Response } from 'express';

import ModelQuiz from '@/models/quiz/quiz';
import ModelQuizPreset from '@/models/quizPreset/quizPreset';
import S3StorageModule from '@/modules/s3Storage.module';
import { BadRequestError } from '@/utils/definedErrors';

class QuizController {
  /**
   * 특정 프리셋 PIN 넘버에 맞는 데이터를 반환하는 함수 getQuizPreset
   */
  static async getQuizPreset(req: Request, res: Response) {
    const { presetPin } = req.query;

    if (!presetPin)
      throw new BadRequestError('요청에 프리셋 PIN 번호가 없습니다.');

    const presetData = await ModelQuizPreset.getQuizPresetById(
      Number(presetPin),
    );

    if (!presetData)
      throw new BadRequestError('해당 PIN 번호를 가진 프리셋이 없습니다.');

    return res.status(200).json(presetData);
  }
  /**
   * 새로운 퀴즈 프리셋을 생성하는 함수 postCreateQuizPreset
   */
  static async postCreateQuizPreset(req: Request, res: Response) {
    const imageFiles = req.files as Express.Multer.File[] | undefined;

    if (!imageFiles || !imageFiles.length)
      throw new BadRequestError('요청으로 보낸 이미지 파일이 없습니다.');

    if (Array.isArray(imageFiles) && imageFiles.length > 9)
      throw new BadRequestError(
        '하나의 프리셋에 퀴즈는 최대 9개까지 가능합니다.',
      );

    const { isPrivate, title, answer } = req.body;

    const createdQuizPresetPIN = await ModelQuizPreset.createQuizPreset({
      isPrivate,
      title,
    });

    const answerList = answer as string[];
    await Promise.all(
      imageFiles.map(async (imageFile, index) => {
        const imageUrl = await S3StorageModule.uploadFileToS3(imageFile);
        const answer = answerList[index];
        await ModelQuiz.createQuizPreset({
          imageUrl,
          answer,
          includedPresetPin: createdQuizPresetPIN,
        });
      }),
    );

    return res.send(200).json({ presetPin: createdQuizPresetPIN });
  }
}

export default QuizController;
