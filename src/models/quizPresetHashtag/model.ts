import { Schema, model } from 'mongoose';

/**
 * 퀴즈 프리셋에 포함된 해시태그 목록 타입
 */
export interface QuizPresetHashtagType {
  presetPin: string;
  hashtagId: string;
}

export const QuizPresetHashtag = new Schema<QuizPresetHashtagType>(
  {
    presetPin: { type: String, required: true },
    hashtagId: { type: String, required: true },
  },
  {
    collection: 'quizPresetHashtags',
    timestamps: true,
    versionKey: false,
  },
);

export default model<QuizPresetHashtagType>(
  'quizPresetHashtags',
  QuizPresetHashtag,
);
