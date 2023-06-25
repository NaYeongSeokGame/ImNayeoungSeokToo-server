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

// _id 필드를 PIN으로 쓰기 위해 아래와 같이 정의
QuizPreset.virtual('presetPin').get(function () {
  return this._id.toString();
});
QuizPreset.set('toJSON', {
  virtuals: true,
});

export default model<QuizPresetType>('quizPresets', QuizPreset);
