import { Schema, model } from 'mongoose';

/**
 * 프리셋에 포함된 퀴즈 모델
 */
export interface Quiz {
  imageUrl: string;
  answer: string;
  quizIndex: number;
}

export const schema = new Schema<Quiz>(
  {
    imageUrl: { type: String, required: true },
    answer: { type: String, required: true },
    quizIndex: { type: Number, required: true },
  },
  {
    collection: 'quizzes',
    timestamps: true,
  },
);

export default model<Quiz>('quizzes', schema);
