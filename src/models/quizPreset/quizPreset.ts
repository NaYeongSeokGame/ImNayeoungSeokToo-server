import { Types } from 'mongoose';

import { BadRequestError } from '@/utils/definedErrors';
import generatePin from '@/utils/generatePin';

import model from './model';
import { type QuizPresetType, type QuizPresetWithThumbnailType } from './model';

class ModelQuizPreset {
  /**
   * 새로운 퀴즈 프리셋을 생성하는 함수 createQuizPreset
   * @param param.isPrivate 공개, 비공개 여부
   * @param param.title 프리셋 제목
   * @param param.quizList 프리셋에 포함된 퀴즈 목록
   * @returns
   */
  static async createQuizPreset({
    presetPin,
    isPrivate,
    title,
  }: QuizPresetType) {
    await model.create({
      presetPin,
      isPrivate,
      title,
    });
  }

  /**
   * 기존의 퀴즈 프리셋을 업데이트 하는 함수 updateQuizPreset
   * @param presetPin 업데이트 하고자 할 presetPin
   * @param updatedPreset 업데이트 하려는 프리셋 데이터
   */
  static async updateQuizPreset(
    presetPin: string,
    updatedPreset: Partial<QuizPresetType>,
  ) {
    await model.updateOne({ presetPin }, { $set: { ...updatedPreset } }).exec();
  }

  /**
   * 퀴즈 프리셋 목록을 불러오는 함수 getQuizPreset
   * @param param.page 불러올 페이지
   * @param param.limit 한 페이지 당 불러올 document 수량
   */
  static async getQuizPreset({ page, limit }: { page: number; limit: number }) {
    const quizPresetList = await model
      .aggregate<QuizPresetWithThumbnailType>([
        {
          $match: { isPrivate: false },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'quizzes',
            localField: 'presetPin',
            foreignField: 'includedPresetPin',
            pipeline: [
              {
                $sort: { createdAt: -1 },
              },
              {
                $limit: 1,
              },
              {
                $project: {
                  _id: 0,
                  answer: 0,
                  includedPresetPin: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  __v: 0,
                },
              },
            ],
            as: 'quizList',
          },
        },
        {
          $unwind: '$quizList',
        },
        {
          $project: {
            title: 1,
            isPrivate: 1,
            presetPin: 1,
            _id: 0,
            thumbnailUrl: '$quizList.imageUrl',
          },
        },
      ])
      .exec();
    return quizPresetList;
  }

  /**
   * 특정 PIN에 맞는 퀴즈 프리셋을 불러오는 함수 getQuizPresetById
   * @param param.page 불러올 페이지
   * @param param.limit 한 페이지 당 불러올 document 수량
   */
  static async getQuizPresetById(presetPin: string) {
    const [quizPresetList] = await model
      .aggregate<QuizPresetWithThumbnailType>([
        {
          $match: { presetPin },
        },
        {
          $unwind: '$_id',
        },
        {
          $lookup: {
            from: 'quizzes',
            localField: 'presetPin',
            foreignField: 'includedPresetPin',
            pipeline: [
              {
                $sort: { createdAt: -1 },
              },
              {
                $limit: 1,
              },
              {
                $project: {
                  _id: 0,
                  answer: 0,
                  includedPresetPin: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  __v: 0,
                },
              },
            ],
            as: 'quizList',
          },
        },
        {
          $unwind: '$quizList',
        },
        {
          $project: {
            title: 1,
            isPrivate: 1,
            presetPin: 1,
            _id: 0,
            thumbnailUrl: '$quizList.imageUrl',
          },
        },
      ])
      .exec();

    return quizPresetList;
  }

  /**
   * 퀴즈 프리셋의 제목으로 프리셋 데이터를 불러오는 함수 getQuizPresetByTitle
   * @param title 검색하려는 퀴즈 프리셋 제목
   */
  static async getQuizPresetByTitle({
    title,
    page,
    limit,
  }: {
    title: string;
    page: number;
    limit: number;
  }) {
    const quizPresetList = await model.aggregate<QuizPresetWithThumbnailType>([
      {
        $match: { title: { $regex: title, $options: 'i' } },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'presetPin',
          foreignField: 'includedPresetPin',
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                _id: 0,
                answer: 0,
                includedPresetPin: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'quizList',
        },
      },
      {
        $unwind: '$quizList',
      },
      {
        $project: {
          title: 1,
          isPrivate: 1,
          presetPin: 1,
          _id: 0,
          thumbnailUrl: '$quizList.imageUrl',
        },
      },
    ]);
    return quizPresetList;
  }

  /**
   * 특정 PIN 에 해당되는 퀴즈 프리셋을 제거하는 함수 deleteQuizPreset
   * @param presetPin 제거하려는 퀴즈 프리셋의 PIN
   */
  static async deleteQuizPreset(presetPin: string) {
    const result = await model
      .deleteOne({ _id: new Types.ObjectId(presetPin) })
      .exec();

    if (!result.deletedCount)
      throw new BadRequestError('요청하신 PIN 에 해당되는 프리셋이 없습니다');
  }

  /**
   * 새롭게 생성할 퀴즈 프리셋 PIN 번호를 생성하는 함수 generateQuizPresetPin
   * @returns 새롭게 생성된 PIN 넘버
   */
  static async generateQuizPresetPin(): Promise<string> {
    const generatedPin = generatePin();
    const isExist = await ModelQuizPreset.getQuizPresetById(generatedPin);
    return isExist ? await this.generateQuizPresetPin() : generatedPin;
  }
}

export default ModelQuizPreset;
