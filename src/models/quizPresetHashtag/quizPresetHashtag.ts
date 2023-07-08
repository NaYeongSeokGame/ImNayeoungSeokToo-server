import model from './model';
import type { QuizPresetHashtagType } from './model';

class ModelQuizPresetHashtag {
  /**
   * 퀴즈 프리셋에 새로운 해시태그를 등록하는 함수 registerHashtagToPreset
   * @param param.hashtagId S3에 등록된 이미지 url
   * @param param.answer 퀴즈의 정답
   * @param param.includedPresetPin 퀴즈가 소속된 프리셋의 pin
   * @returns
   */
  static async registerHashtagToPreset({
    hashtagId,
    presetPin,
  }: QuizPresetHashtagType) {
    const createdQuizPresetDocs = await model.create({
      hashtagId,
      presetPin,
    });
    return createdQuizPresetDocs;
  }

  /**
   * 퀴즈 프리셋에 포함된 해시태그 ID 목록을 불러오는 함수 getHashtagIdsFromPreset
   * @param presetPin 퀴즈 프리셋 PIN
   */
  static async getHashtagIdsFromPreset(presetPin: string) {
    const hashtagIdList = model
      .find({ presetPin }, { hashtagId: 1 })
      .lean()
      .exec();
    return hashtagIdList;
  }
}

export default ModelQuizPresetHashtag;
