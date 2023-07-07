export type PostCreateQuizPresetReqBodyType = {
  answers: string[];
  title: string;
  isPrivate: boolean | undefined;
};

export type DeleteQuizPresetReqQueryType = {
    presetPin: string | undefined;
}

export type GetQuizPresetListReqQueryType = {
    page: number;
    limit: number;
}