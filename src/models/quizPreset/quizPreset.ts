import { BadRequestError } from '@/utils/definedErrors';

import model from './model';
import type { QuizPresetType } from './model';

class ModelQuizPreset {
  /**
   * 새로운 퀴즈 프리셋을 생성하는 함수 createQuizPreset
   * @param param.isPrivate 공개, 비공개 여부
   * @param param.title 프리셋 제목
   * @param param.quizList 프리셋에 포함된 퀴즈 목록
   * @returns
   */
  static async createQuizPreset({
    isPrivate,
    title,
    quizList,
  }: Partial<QuizPresetType>) {
    const createdQuizPresetDocs = await model.create({
      isPrivate,
      title,
      quizList,
    });
    return createdQuizPresetDocs._id.toString();
  }

  /**
   * 기존의 퀴즈 프리셋을 업데이트 하는 함수 updateQuizPreset
   * @param _id
   * @param updatedPreset
   */
  static async updateQuizPreset(
    _id: string,
    updatedPreset: Partial<QuizPresetType>,
  ) {
    await model.updateOne({ _id }, { $set: { ...updatedPreset } }).exec();
  }

  /**
   * 퀴즈 프리셋 목록을 불러오는 함수 getQuizPreset
   * @param param.page 불러올 페이지
   * @param param.limit 한 페이지 당 불러올 document 수량
   */
  static async getQuizPreset({ page, limit }: { page: number; limit: number }) {
    const quizPresetList = await model
      .find({ isPrivate: false }, { title: 1, presetPin: 1, quizList: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
    return quizPresetList;
  }

  /**
   * 특정 PIN에 맞는 퀴즈 프리셋을 불러오는 함수 getQuizPresetById
   * @param param.page 불러올 페이지
   * @param param.limit 한 페이지 당 불러올 document 수량
   */
  static async getQuizPresetById(_id: string) {
    const quizPresetList = await model
      .findOne({ _id }, { title: 1, presetPin: 1, quizList: 1 })
      .lean()
      .exec();
    return quizPresetList;
  }

  static async deleteQuizPreset(presetPin: number) {
    const result = await model.deleteOne({ presetPin }).exec();

    if (!result.deletedCount)
      throw new BadRequestError('요청하신 PIN 에 해당되는 프리셋이 없습니다');
  }
}

export default ModelQuizPreset;
