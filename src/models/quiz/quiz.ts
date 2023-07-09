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

  /**
   * 특정 퀴즈 프리셋 PIN 에 포함된 퀴즈 목록을 가져오는 함수 getQuizListInPreset
   * @param includedPresetPin 퀴즈 프리셋 PIN
   */
  static async getQuizListInPreset(includedPresetPin: string) {
    const quizListInPreset = await model
      .find({ includedPresetPin }, { imageUrl: 1, answer: 1, _id: 0 })
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
}

export default ModelQuiz;
