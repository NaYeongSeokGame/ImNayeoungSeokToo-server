import { Schema, model } from 'mongoose';

/**
 * 퀴즈 프리셋 모델 타입
 */
export interface QuizPresetType {
  isPrivate: boolean;
  title: string;
}

/**
 * 퀴즈 프리셋 모델에 Pin 넘버 및 썸네일 Url이 포함된 타입
 */
export type QuizPresetWithInfoType = QuizPresetType & {
  presetPin: string;
  thumbnailUrl: string;
};

const QuizPreset = new Schema<QuizPresetType>(
  {
    isPrivate: { type: Boolean, required: true, default: false },
    title: { type: String, required: true },
  },
  {
    collection: 'quizPresets',
    timestamps: true,
  },
);

export default model<QuizPresetType>('quizPresets', QuizPreset);
