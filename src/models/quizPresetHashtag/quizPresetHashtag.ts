import type { FilterQuery, ProjectionType } from 'mongoose';

import { PaginatedType } from '@/types/util';

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
  static async getPresetListByHashtagId({
    hashtagId,
    page,
    limit,
  }: PaginatedType<Pick<QuizPresetHashtagType, 'hashtagId'>>) {
    const queryResult = await model
      .find({ hashtagId }, { presetPin: 1, _id: 0 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const presetPinList = queryResult.map(({ presetPin }) => presetPin);
    return presetPinList;
  }

  /**
   * 주어진 조건에 맞는 해시태그 목록을 불러오는 함수 get
   * @param query 가져오려는 Quiz 데이터에 부합하는 조건
   */
  static async find(
    query: FilterQuery<QuizPresetHashtagType>,
    projection?: ProjectionType<QuizPresetHashtagType>,
  ) {
    const quizList = await model.find(query, projection).lean().exec();
    return quizList;
  }

  /**
   * 주어진 조건에 맞는 해시태그 목록을 일괄 삭제하는 함수 deleteMany
   * @param query 가져오려는 Quiz 데이터에 부합하는 조건
   */
  static async deleteMany(query: FilterQuery<QuizPresetHashtagType>) {
    await model.deleteMany(query).exec();
  }
}

export default ModelQuizPresetHashtag;
