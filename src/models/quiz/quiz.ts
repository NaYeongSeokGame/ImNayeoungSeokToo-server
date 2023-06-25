import model from './model';
import type { Quiz } from './model';

export const createQuiz = async ({ quizIndex, imageUrl, answer }: Quiz) => {
  await model.create({ quizIndex, answer, imageUrl });
};

export const updateQuiz = 
