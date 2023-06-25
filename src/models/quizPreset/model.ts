import { Schema, Types, model } from 'mongoose';

/**
 * 프리셋에 포함된 퀴즈 모델
 */
export interface QuizPreset {
  presetPin: number;
  isPrivate: boolean;
  title: string;
  quizList: Types.DocumentArray<Types.ObjectId>;
}

const schema = new Schema<QuizPreset>(
  {
    presetPin: { type: Number, required: true },
    isPrivate: { type: Boolean, required: true, default: false },
    title: { type: String, required: true },
    quizList: {
      type: [Schema.Types.ObjectId],
      ref: 'quizzes',
      default: [],
    },
  },
  {
    collection: 'quizPresets',
    timestamps: true,
  },
);

export default model<QuizPreset>('quizPresets', schema);
