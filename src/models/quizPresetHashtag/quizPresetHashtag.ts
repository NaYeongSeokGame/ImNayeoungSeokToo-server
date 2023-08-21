import model from './model';
import type { QuizPresetHashtagType } from './model';

class ModelQuizPresetHashtag {
  /**
   * 퀴즈 프리셋에 새로운 해시태그를 등록하는 함수 createHashtagToPreset
   * @param param.hashtagId 새롭게 등록하고자 하는 Hashtag Id
   * @param param.presetPin 해시태그를 등록하려는 프리셋 PIN
   * @returns
   */
  static async createHashtagToPreset({
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
    const queryResult = await model
      .find({ presetPin }, { hashtagId: 1, _id: 0 })
      .lean()
      .exec();

    const hashtagIdList = queryResult.map(({ hashtagId }) => hashtagId);
    return hashtagIdList;
  }

  /**
   * 특정 해시태그 ID 를 포함한 퀴즈 프리셋 목록을 가져오는 함수 getPresetListByHashtagId
   * @param hashtagId 해시태그 ID 
   */
    static async getPresetListByHashtagId(hashtagId: string) {
      const queryResult = await model
        .find({ hashtagId }, { presetPin: 1, _id: 0 })
        .lean()
        .exec();
  
      const presetPinList = queryResult.map(({ presetPin }) => presetPin);
      return presetPinList;
    }
  

  /**
   * 프리셋에 등록되었던 해시태그를 삭제하는 함수 deleteHashtagIdsFromPreset
   * @param param.hashtagId 프리셋에서 삭제하려는 Hashtag Id
   * @param param.presetPin 해시태그를 수정하려는 프리셋 PIN
   * @returns
   */
  static async deleteHashtagIdsFromPreset({
    hashtagId,
    presetPin,
  }: QuizPresetHashtagType) {
    const hashtagIdList = await model
      .deleteOne({ presetPin, hashtagId })
      .lean()
      .exec();
    return hashtagIdList;
  }
}

export default ModelQuizPresetHashtag;
