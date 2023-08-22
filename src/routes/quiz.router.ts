import express from 'express';

import QuizController from '@/controllers/quiz.controller';
import upload from '@/middlewares/multer';
import midResizeImage from '@/middlewares/resizeImage';
import { errorCatchHandler } from '@/utils/errorCatchHandler';

const quizRouter = express.Router();

quizRouter.get('/', errorCatchHandler(QuizController.getQuizPreset));
quizRouter.get('/list', errorCatchHandler(QuizController.getQuizPresetList));
quizRouter.get('/answer', errorCatchHandler(QuizController.getQuizAnswerList));
quizRouter.get(
  '/search',
  errorCatchHandler(QuizController.getQuizPresetListBySearch),
);

quizRouter.delete(
  '/remove',
  errorCatchHandler(QuizController.deleteQuizPreset),
);

quizRouter.post(
  '/create',
  upload.array('images'),
  midResizeImage,
  errorCatchHandler(QuizController.postCreateQuizPreset),
);

export default quizRouter;
