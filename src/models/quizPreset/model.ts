import { Schema, model } from 'mongoose';

/**
 * 프리셋에 포함된 퀴즈 모델
 */
export interface QuizPresetType {
  isPrivate: boolean;
  title: string;
}

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
