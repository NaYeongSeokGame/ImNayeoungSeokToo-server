import type { FilterQuery, ProjectionType } from 'mongoose';

import model from './model';
import type { QuizType } from './model';

class ModelQuiz {
  /**
   * 새로운 퀴즈를 생성하는 함수 createQuizPreset
   * @param param.imageUrl S3에 등록된 이미지 url
   * @param param.answer 퀴즈의 정답
   * @param param.includedPresetPin 퀴즈가 소속된 프리셋의 pin
   * @param param.hint 퀴즈의 힌트
   * @param param.sequence 프리셋 내의 퀴즈의 등록 순서
   * @returns
   */
  static async createQuizPreset({
    imageUrl,
    answer,
    includedPresetPin,
    hint,
    sequence,
  }: QuizType) {
    const createdQuizPresetDocs = await model.create({
      imageUrl,
      answer,
      includedPresetPin,
      hint,
      sequence,
    });
    return createdQuizPresetDocs;
  }

  /**
   * 기존의 퀴즈를 업데이트 하는 함수 updateQuizPreset
   * @param _id 업데이트 하고자 하는 퀴즈의 _id field
   * @param updatedPreset 업데이트 할 퀴즈의 정보
   */
  static async updateQuizPreset(
    _id: string,
    updatedQuiz: Omit<Partial<QuizType>, '_id'>,
  ) {
    await model.updateOne({ _id }, { $set: { ...updatedQuiz } }).exec();
  }

  /**
   * 기존의 퀴즈를 새롭게 덮어씌우는 함수 replaceQuizPreset
   * @param _id 교체하고자 하는 퀴즈의 _id
   * @param replacedQuiz 교체될 새로운 퀴즈의 정보
   */
  static async replaceQuizPreset(_id: string, replacedQuiz: QuizType) {
    await model.replaceOne({ _id }, replacedQuiz);
  }

  /**
   * 특정 퀴즈 프리셋 PIN 에 포함된 퀴즈 목록을 가져오는 함수 getQuizListInPreset
   * @param includedPresetPin 퀴즈 프리셋 PIN
   */
  static async getQuizListInPreset(includedPresetPin: string) {
    const quizListInPreset = await model
      .find({ includedPresetPin }, { imageUrl: 1, answer: 1, hint: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return quizListInPreset;
  }

  /**
   * 특정 퀴즈 프리셋 PIN 에 등록된 퀴즈 중, 첫 번째 퀴즈의 imageUrl을 반환하는 함수 getThumbnailImageUrl
   * @param includedPresetPin 퀴즈 프리셋 PIN
   */
  static async getThumbnailImageUrl(includedPresetPin: string) {
    const quizListInPreset = await model
      .findOne({ includedPresetPin }, { imageUrl: 1 })
      .lean()
      .exec();
    return quizListInPreset;
  }

  /**
   * 특정 퀴즈 프리셋 PIN 에 포함된 퀴즈를 일괄로 삭제하는 함수 deleteQuizInPreset
   * @param includedPresetPin 삭제하고자 하는 퀴즈 프리셋 PIN
   */
  static async deleteQuizInPreset(includedPresetPin: string) {
    await model.deleteMany({ includedPresetPin }).exec();
  }

  /**
   * 주어진 조건에 맞는 Quiz 데이터 목록을 불러오는 함수 getQuiz
   * @param query 가져오려는 Quiz 데이터에 부합하는 조건
   */
  static async getQuiz(query: FilterQuery<QuizType>, projection?: ProjectionType<QuizType>) {
    const quizList = await model.find(query, projection).lean().exec();
    return quizList;
  }

  /**
   * 주어진 조건에 맞는 Quiz 데이터 목록을 삭제하는 함수 deleteQuiz
   * @param query 삭제하려는 Quiz 데이터에 부합하는 조건
   */
  static async deleteQuiz(query: FilterQuery<QuizType>) {
    await model.deleteMany(query).exec();
  }
}

export default ModelQuiz;
