import express from 'express';

import docsRouter from './docs.router';

const router = express.Router();

const routerList = [
  {
    path: '/docs',
    route: docsRouter,
  },
];

routerList.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
