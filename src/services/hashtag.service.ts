import { HashtagType } from '@/models/hashtag';
import ModelHashTag from '@/models/hashtag/hashtag';
import ModelQuizPreset from '@/models/quizPreset/quizPreset';
import ModelQuizPresetHashtag from '@/models/quizPresetHashtag/quizPresetHashtag';
import { type PaginatedType } from '@/types/util';

class ServiceHashtag {
  /**
   * 특정 퀴즈 프리셋에 연결된 해시태그 컨텐츠를 가져오는 함수 injectHashtagContent
   * @param presetPin 해시태그 목록을 가져올 퀴즈 프리셋 PIN
   */
  static async getHashtagListByPresetId(presetPin: string) {
    const hashtagIdList = await ModelQuizPresetHashtag.getHashtagIdsFromPreset(
      presetPin,
    );
    const hashtagList = await Promise.all(
      hashtagIdList.map((hashtagId) =>
        ModelHashTag.getHashtagContentById(hashtagId),
      ),
    );
    return hashtagList;
  }

  /**
   * 특정 퀴즈 프리셋에 새로운 해시태그를 등록시키는 함수 registerHashtagToPreset
   * @param param.presetPin 새로운 해시태그를 등록하려는 퀴즈 프리셋 PIN
   * @param param.hashtagContentList 새롭게 등록하고자 하는 해시태그 목록
   */
  static async registerHashtagToPreset({
    presetPin,
    hashtagContentList,
  }: {
    presetPin: string;
    hashtagContentList: string[];
  }) {
    const hashtagIdList = await Promise.all(
      hashtagContentList.map(async (hashtagContent) => {
        let hashtagId = await ModelHashTag.getHashtagIdByContent(
          hashtagContent,
        );
        if (!hashtagId) {
          hashtagId = await ModelHashTag.createHashtag(hashtagContent);
        }
        return hashtagId;
      }),
    );
    await Promise.all(
      hashtagIdList.map((hashtagId) =>
        ModelQuizPresetHashtag.createHashtagToPreset({ hashtagId, presetPin }),
      ),
    );
  }

  /**
   * 퀴즈 프리셋에 등록된 해시태그를 일괄 삭제하는 함수 deleteHashtagOfPreset
   * @param presetPin 해시태그를 제거할 프리셋의 PIN
   */
  static async deleteHashtagOfPreset(presetPin: string) {
    const hashtagIdList = await ModelQuizPresetHashtag.getHashtagIdsFromPreset(
      presetPin,
    );
    await Promise.all(
      hashtagIdList.map((hashtagId) =>
        ModelQuizPresetHashtag.deleteHashtagIdsFromPreset({
          hashtagId,
          presetPin,
        }),
      ),
    );
  }

  static async getQuizPresetByHashtag({
    content,
    page,
    limit,
  }: PaginatedType<Pick<HashtagType, 'content'>>) {
    const hashtagId = await ModelHashTag.getHashtagIdByContent(content);

    if (!hashtagId) return [];

    const presetPinList = await ModelQuizPresetHashtag.getPresetListByHashtagId(
      {
        hashtagId,
        page,
        limit,
      },
    );

    const presetDataList = await Promise.all(
      presetPinList.map((presetPin) =>
        ModelQuizPreset.getQuizPresetById(presetPin),
      ),
    );

    return presetDataList;
  }
}

export default ServiceHashtag;
