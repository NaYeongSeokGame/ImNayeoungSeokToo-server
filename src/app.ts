import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import { DEV_CONFIG, PROD_CONFIG } from '@/constants/index';
import router from '@/routes/index';
import connection from '@/utils/connectMongoDB';
import errorHandler from '@/utils/errorHandler';

dotenv.config();

const isProd: boolean = process.env.NODE_ENV === 'production';
const CURRENT_CONFIG = isProd ? PROD_CONFIG : DEV_CONFIG;

// SSL 관련 인증을 Dev 환경에서 무시하기 위해 추가
if (!isProd) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
}

const initExpressApp = () => {
  const app = express();

  // Body Parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS Setting
  app.use(
    cors({
      origin: true, // FIXME : 로컬 환경에서의 테스트를 위해 CORS 임시 해제
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
  );

  //Router List
  app.use('/api/v1', router);

  app.get('/', (_, res) => {
    res.status(200).send('NaYeongSeokGame Server has been Enabled.');
  });

  app.listen(CURRENT_CONFIG.port, () => {
    console.log(`server is running on ${CURRENT_CONFIG.port}`);
  });

  // Security (배포 환경에서만 적용)
  if (isProd) {
    const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();
    delete cspDefaults['upgrade-insecure-requests'];

    app.use(
      helmet({
        contentSecurityPolicy: { directives: cspDefaults },
      }),
    );

    app.use(hpp());
    app.set('trust proxy', true);
  }

  // Error Handler
  app.use(errorHandler);

  // leak problem
  app.disable('x-powered-by');
};

// mongodb connection
connection().then(initExpressApp);
