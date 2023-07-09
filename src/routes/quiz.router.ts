import express from 'express';

import QuizController from '@/controllers/quiz.controllers';
import upload from '@/middlewares/multer';
import { errorCatchHandler } from '@/utils/errorCatchHandler';

const quizRouter = express.Router();

quizRouter.get('/', errorCatchHandler(QuizController.getQuizPreset));
quizRouter.get('/list', errorCatchHandler(QuizController.getQuizPresetList));
quizRouter.get('/answer', errorCatchHandler(QuizController.getQuizAnswerList));

quizRouter.delete(
  '/remove',
  errorCatchHandler(QuizController.deleteQuizPreset),
);

quizRouter.post(
  '/create',
  upload.array('images'),
  errorCatchHandler(QuizController.postCreateQuizPreset),
);

export default quizRouter;
