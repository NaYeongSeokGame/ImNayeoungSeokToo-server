import express from 'express';

import docsRouter from './docs.router';
import quizRouter from './quiz.router';

const router = express.Router();

const routerList = [
  {
    path: '/api-docs',
    route: docsRouter,
  },
  { path: '/quiz', route: quizRouter },
];

routerList.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
