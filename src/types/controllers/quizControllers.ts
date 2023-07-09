export type PostCreateQuizPresetReqBodyType = {
  answers: string[];
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
