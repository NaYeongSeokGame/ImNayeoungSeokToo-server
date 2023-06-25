import { Schema, model } from 'mongoose';

import { Quiz } from '@/models/quiz/model';
import type { QuizType } from '@/models/quiz/model';

/**
 * 프리셋에 포함된 퀴즈 모델
 */
export interface QuizPresetType {
  presetPin: number;
  isPrivate: boolean;
  title: string;
  quizList: QuizType[];
}

const QuizPreset = new Schema<QuizPresetType>(
  {
    presetPin: { type: Number, required: true },
    isPrivate: { type: Boolean, required: true, default: false },
    title: { type: String, required: true },
    quizList: {
      type: [Quiz],
      default: [],
    },
  },
  {
    collection: 'quizPresets',
    timestamps: true,
  },
);

export default model<QuizPresetType>('quizPresets', QuizPreset);
