import express from 'express';

import QuizController from '@/controllers/quiz.controller';
import upload from '@/middlewares/multer';
import midResizeImage from '@/middlewares/resizeImage';
import midValidation from '@/middlewares/validate';
import { errorCatchHandler } from '@/utils/errorCatchHandler';
import { quizPresetSchema } from '@/validations/quiz.validation';

const quizRouter = express.Router();

quizRouter.get(
  '/',
  midValidation(quizPresetSchema.get),
  errorCatchHandler(QuizController.getQuizPreset),
);

quizRouter.get(
  '/list',
  midValidation(quizPresetSchema.getList),
  errorCatchHandler(QuizController.getQuizPresetList),
);

quizRouter.get(
  '/answer',
  midValidation(quizPresetSchema.get),
  errorCatchHandler(QuizController.getQuizAnswerList),
);

quizRouter.get(
  '/search',
  midValidation(quizPresetSchema.getBySearch),
  errorCatchHandler(QuizController.getQuizPresetListBySearch),
);

quizRouter.delete(
  '/remove',
  midValidation(quizPresetSchema.delete),
  errorCatchHandler(QuizController.deleteQuizPreset),
);

quizRouter.post(
  '/create',
  upload.array('images'),
  midValidation(quizPresetSchema.postCreate),
  midResizeImage,
  errorCatchHandler(QuizController.postCreateQuizPreset),
);

export default quizRouter;
