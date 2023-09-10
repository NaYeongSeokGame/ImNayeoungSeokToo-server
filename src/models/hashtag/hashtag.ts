import type { FilterQuery, ProjectionType } from 'mongoose';

import model from './model';
import type { HashtagType } from './model';

class ModelHashTag {
  /**
   * 새로운 해시태그를 생성하는 함수 createHashtag
   * @param param.content 새롭게 등록할 해시태그 컨텐츠
   */
  static async createHashtag(content: string) {
    const createdHashtagDocs = await model.create({
      content,
    });
    return createdHashtagDocs._id.toString();
  }

  /**
   * ID를 기반으로 해시태그 내용을 가져오는 함수 getHashtagContentById
   * @param hashtagId 해시태그 ID
   */
  static async getHashtagContentById(hashtagId: string) {
    const hashtagContent = await model
      .findById(hashtagId, { content: 1, _id: 0 })
      .lean()
      .exec();
    return hashtagContent?.content ?? null;
  }

  /**
   * 컨텐츠를 기반으로 해시태그 ID를 가져오는 함수 getHashtagIdByContent
   * @param content 해시태그 컨텐츠
   */
  static async getHashtagIdByContent(content: string) {
    const hashtagId = await model
      .findOne(
        {
          content,
        },
        { _id: 1 },
      )
      .lean()
      .exec();

    return hashtagId?._id.toString() ?? null;
  }

  /**
   * 주어진 조건에 맞는 해시태그 데이터를 불러오는 함수 find
   * @param query 가져오려는 Quiz 데이터에 부합하는 조건
   */
  static async find(
    query: FilterQuery<HashtagType>,
    projection?: ProjectionType<HashtagType>,
  ) {
    const quizList = await model.find(query, projection).lean().exec();
    return quizList;
  }

  /**
   * 주어진 조건에 맞는 해시태그를 일괄 삭제하는 함수 deleteMany
   * @param query 가져오려는 Quiz 데이터에 부합하는 조건
   */
  static async deleteMany(query: FilterQuery<HashtagType>) {
    await model.deleteMany(query).exec();
  }
}

export default ModelHashTag;
