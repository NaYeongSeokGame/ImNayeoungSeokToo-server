import model from './model';
import type { HashtagType } from './model';

class ModelHashTag {
  /**
   * 새로운 해시태그를 생성하는 함수 createHashtag
   * @param param.content 새롭게 등록할 해시태그 컨텐츠
   * @returns
   */
  static async createHashtag({
    content
  }: HashtagType) {
    const createdHashtagDOcs = await model.create({
        content
    });
    return createdHashtagDOcs;
  }
}

export default ModelHashTag;
