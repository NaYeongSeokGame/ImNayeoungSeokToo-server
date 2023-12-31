import { Schema, model } from 'mongoose';

/**
 * 프리셋에 포함된 퀴즈 모델
 */
export interface QuizType {
  quizIndex: string;
  imageUrl: string;
  answer: string;
  hint?: string;
  includedPresetPin: string;
}

export const Quiz = new Schema<QuizType>(
  {
    quizIndex: { type: String, required: true },
    imageUrl: { type: String, required: true },
    answer: { type: String, required: true },
    hint: { type: String },
    includedPresetPin: { type: String, required: true },
  },
  {
    collection: 'quizzes',
    timestamps: true,
    versionKey: false,
  },
);

export default model<QuizType>('quizzes', Quiz);
