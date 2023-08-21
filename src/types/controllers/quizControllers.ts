export type PostCreateQuizPresetReqBodyType = {
  answers: string[] | string;
  hints: (string | null)[] | (string | null);
  title: string;
  isPrivate: boolean | undefined;
  hashtagContentList: string[];
};

export type DeleteQuizPresetReqQueryType = {
  presetPin: string | undefined;
};

export type GetQuizPresetListReqQueryType = {
  page: number;
  limit: number;
};

export type GetQuizPresetReqQueryType = {
  presetPin: string | string[];
};

export type GetQuizPresetBySearchReqQueryType = {
  type: 'title' | 'hashtag';
  keyword: string;
  page: number;
  limit: number;
}
