import model from './model';
import type { QuizPreset } from './model';

export const createQuizPreset = async ({ isPrivate, title, quizList }: Partial<QuizPreset>) => {
  await model.create({ quizIndex, answer, imageUrl });
};

export const updateQuiz = 
