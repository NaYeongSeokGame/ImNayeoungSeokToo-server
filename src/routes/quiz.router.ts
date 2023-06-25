import express from 'express';

import QuizController from '@/controllers/quiz.controllers';
import upload from '@/middlewares/multer';
import { errorCatchHandler } from '@/utils/errorCatchHandler';

const router = express.Router();

router.get('/', errorCatchHandler(QuizController.getQuizPreset));
router.post(
  '/create',
  upload.array('images'),
  errorCatchHandler(QuizController.postCreateQuizPreset),
);
