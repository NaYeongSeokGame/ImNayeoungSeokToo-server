import ModelQuiz from '@/models/quiz/quiz';
import ModelQuizPreset from '@/models/quizPreset/quizPreset';
import ModelQuizPresetHashtag from '@/models/quizPresetHashtag/quizPresetHashtag';
import ServiceHashtag from '@/services/hashtag.service';
import ServiceQuiz from '@/services/quiz.service';
import { type ValidatedRequestHandler } from '@/types/util';
import { BadRequestError } from '@/utils/definedErrors';
import { QuizPresetSchema } from '@/validations/quiz.validation';

class QuizController {
  /**
   * 특정 프리셋 PIN 넘버에 맞는 데이터를 반환하는 함수 getQuizPreset
   */
  static getQuizPreset: ValidatedRequestHandler<QuizPresetSchema['get']> =
    async (req, res) => {
      const { presetPin } = res.locals.query;

      if (typeof presetPin === 'string') {
        const presetData = await ModelQuizPreset.getQuizPresetById(presetPin);

        if (!presetData)
          throw new BadRequestError('해당 PIN 번호를 가진 프리셋이 없습니다.');

        const quizList = await ModelQuiz.getQuizListInPreset(presetPin);
        const hashtagList = await ServiceHashtag.getHashtagListByPresetId(
          presetPin,
        );

        return res.status(200).json({ ...presetData, quizList, hashtagList });
      }

      if (Array.isArray(presetPin)) {
        const presetDataList = await Promise.all(
          presetPin.map(async (pin) => {
            const presetData = await ModelQuizPreset.getQuizPresetById(pin);
            if (!presetData)
              throw new BadRequestError(
                '해당 PIN 번호를 가진 프리셋이 없습니다.',
              );
            const quizList = await ModelQuiz.getQuizListInPreset(pin);
            const hashtagList = await ServiceHashtag.getHashtagListByPresetId(
              pin,
            );
            return { ...presetData, quizList, hashtagList };
          }),
        );

        return res.status(200).json({ ...presetDataList });
      }

      throw new BadRequestError('유효하지 않은 프리셋 PIN 번호입니다.');
    };

  /**
   * 특정 프리셋 PIN 넘버의 퀴즈 정답 목록을 반환하는 함수 getQuizAnswerList
   */
  static getQuizAnswerList: ValidatedRequestHandler<
    QuizPresetSchema['getAnswer']
  > = async (req, res) => {
    const { presetPin } = res.locals.query;

    if (!presetPin)
      throw new BadRequestError('요청에 담긴 프리셋 PIN 이 없습니다.');

    const answerList = await ModelQuiz.getQuizListInPreset(presetPin);

    if (!answerList.length)
      throw new BadRequestError('유효하지 않은 프리셋 PIN 번호입니다.');

    return res.status(200).json({ ...answerList });
  };
  /**
   * 페이지네이션을 기반으로 프리셋 목록을 전달하는 함수 getQuizPresetList
   */
  static getQuizPresetList: ValidatedRequestHandler<
    QuizPresetSchema['getList']
  > = async (req, res) => {
    const { page, limit } = res.locals.query;

    let presetDataList = await ModelQuizPreset.getQuizPreset({
      page,
      limit,
    });

    // NOTE : 프리셋 목록을 순회하며 해시태그 정보를 주입하는 로직
    presetDataList = await Promise.all(
      presetDataList.map(async (presetData) => {
        const { presetPin } = presetData;
        const hashtagList = await ServiceHashtag.getHashtagListByPresetId(
          presetPin,
        );
        return { ...presetData, hashtagList };
      }),
    );

    return res.status(200).json(presetDataList);
  };

  /**
   * 해시태그, 제목 검색을 통해 퀴즈 프리셋 목록을 불러오는 함수 getQuizPresetListBySearch
   */
  static getQuizPresetListBySearch: ValidatedRequestHandler<
    QuizPresetSchema['getBySearch']
  > = async (req, res) => {
    const { page = 1, limit = 9, keyword, type } = res.locals.query;

    switch (type) {
      case 'title': {
        const presetDataList = await ModelQuizPreset.getQuizPresetByTitle({
          title: keyword,
          page,
          limit,
        });
        return res.status(200).json(presetDataList);
      }
      case 'hashtag': {
        const presetDataList = await ServiceHashtag.getQuizPresetByHashtag({
          content: keyword,
          page,
          limit,
        });
        return res.status(200).json(presetDataList);
      }
      default:
        throw new BadRequestError(
          '퀴즈 프리셋 검색 타입은 title, hashtag 만 가능합니다.',
        );
    }
  };

  /**
   * 새로운 퀴즈 프리셋을 생성하는 함수 postCreateQuizPreset
   */
  static postCreateQuizPreset: ValidatedRequestHandler<
    QuizPresetSchema['postCreate']
  > = async (req, res) => {
    const imageFiles = req.files as Express.Multer.File[] | undefined;

    if (!imageFiles || !imageFiles.length)
      throw new BadRequestError('요청으로 보낸 이미지 파일이 없습니다.');

    const { isPrivate = false, title, answers, hints, hashtagList } = req.body;

    const presetPin = await ModelQuizPreset.generateQuizPresetPin();

    await ModelQuizPreset.createQuizPreset({
      presetPin,
      isPrivate,
      title,
    });

    await ServiceQuiz.registerQuizWithImage({
      answers: Array.isArray(answers) ? answers : [answers],
      hints: Array.isArray(hints) ? hints : [hints],
      imageFiles,
      presetPin,
    });

    if (hashtagList) {
      await ServiceHashtag.registerHashtagToPreset({
        presetPin,
        hashtagList: Array.isArray(hashtagList) ? hashtagList : [hashtagList],
      });
    }

    return res.json({ presetPin });
  };

  /**
   * 기존의 프리셋을 삭제하는 함수 deleteQuizPreset
   */
  static deleteQuizPreset: ValidatedRequestHandler<QuizPresetSchema['delete']> =
    async (req, res) => {
      const { presetPin } = res.locals.query;

      const quizList = await ModelQuiz.getQuizListInPreset(presetPin);

      if (!quizList.length)
        throw new BadRequestError('유효하지 않은 PIN 번호입니다.');

      const imageUrlList = quizList.map(({ imageUrl }) => imageUrl);

      await ServiceQuiz.deleteQuizAllInPreset({
        imageUrls: imageUrlList,
        presetPin,
      });

      await ServiceHashtag.deleteHashtagOfPreset(presetPin);

      return res.sendStatus(200);
    };

  static patchModifyQuiz: ValidatedRequestHandler<
    QuizPresetSchema['patchModify']
  > = async (req, res) => {
    const {
      presetPin,
      title,
      isPrivate,
      addQuizAnswers: answers,
      addQuizHints: hints,
      addHashtagList,
      removedQuizIndexList,
      removedHashtagList,
    } = req.body;

    const imageFiles = req.files as Express.Multer.File[] | undefined;

    if (!imageFiles || !imageFiles.length)
      throw new BadRequestError('요청으로 보낸 이미지 파일이 없습니다.');

    if (title || isPrivate)
      await ModelQuizPreset.updateQuizPreset(presetPin, { title, isPrivate });

    // NOTE : 제거하려는 퀴즈를 먼저 없애고, 이후 새로운 퀴즈를 등록한다.
    if (removedQuizIndexList?.length) {
      await ServiceQuiz.deleteQuizByIndex({
        presetPin,
        quizIndexList: removedQuizIndexList,
      });
    }

    if (answers?.length && hints?.length) {
      await ServiceQuiz.registerQuizWithImage({
        answers: Array.isArray(answers) ? answers : [answers],
        hints: Array.isArray(hints) ? hints : [hints],
        imageFiles,
        presetPin,
      });
    }

    // NOTE : 새롭게 추가된 해시태그를 먼저 등록하고, 이후 제거하려는 해시태그를 삭제한다.
    if (addHashtagList) {
      await ServiceHashtag.registerHashtagToPreset({
        presetPin,
        hashtagList: Array.isArray(addHashtagList)
          ? addHashtagList
          : [addHashtagList],
      });
    }

    if (removedHashtagList) {
      await ModelQuizPresetHashtag.deleteMany({
        contents: {
          $in: Array.isArray(removedHashtagList)
            ? removedHashtagList
            : [removedHashtagList],
        },
      });
    }

    return res.sendStatus(200);
  };
}

export default QuizController;
