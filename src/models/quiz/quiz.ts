import { Types } from 'mongoose';

import model from './model';
import type { QuizType } from './model';

class ModelQuiz {
  /**
   * 새로운 퀴즈를 생성하는 함수 createQuizPreset
   * @param param.imageUrl S3에 등록된 이미지 url
   * @param param.answer 퀴즈의 정답
   * @param param.includedPresetPin 퀴즈가 소속된 프리셋의 pin
   * @returns
   */
  static async createQuizPreset({
    imageUrl,
    answer,
    includedPresetPin,
  }: QuizType) {
    const createdQuizPresetDocs = await model.create({
      imageUrl,
      answer,
      includedPresetPin,
    });
    return createdQuizPresetDocs;
  }

  /**
   * 기존의 퀴즈를 업데이트 하는 함수 updateQuizPreset
   * @param _id 업데이트 하고자 하는 퀴즈의 _id field
   * @param updatedPreset 업데이트 할 퀴즈의 정보
   */
  static async updateQuizPreset(_id: string, updatedQuiz: Partial<QuizType>) {
    await model.updateOne({ _id }, { $set: { ...updatedQuiz } }).exec();
  }

  static async getQuizListInPreset(includedPresetPin: string) {
    const quizListInPreset = await model
      .find({ includedPresetPin }, { imageUrl: 1, answer: 1, _id: 1 })
      .lean()
      .exec();
    return quizListInPreset;
  }

  static async deleteQuiz(_id: string) {
    await model.deleteOne({ _id }).exec();
  }
}

export default ModelQuiz;
