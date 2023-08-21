import { type PaginatedType } from '../util';

export type PostCreateQuizPresetReqBodyType = {
  answers: string[] | string;
  hints: (string | null)[] | (string | null);
  title: string;
  isPrivate: boolean | undefined;
  hashtagList: string[];
};

export type DeleteQuizPresetReqQueryType = {
  presetPin: string | undefined;
};

export type GetQuizPresetListReqQueryType = PaginatedType;

export type GetQuizPresetReqQueryType = {
  presetPin: string | string[];
};

export type GetQuizPresetBySearchReqQueryType = PaginatedType<{
  type: 'title' | 'hashtag';
  keyword: string;
}>;
