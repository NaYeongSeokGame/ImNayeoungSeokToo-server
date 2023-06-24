import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import { DEV_CONFIG, PROD_CONFIG } from '@/constants/index';
import docsRouter from '@/routes/docs';
import errorHandler from '@/utils/errorHandler';

dotenv.config();

const isProd: boolean = process.env.NODE_ENV === 'production';
const CURRENT_CONFIG = isProd ? PROD_CONFIG : DEV_CONFIG;

const app = express();

// Security (배포 환경에서만 적용)
if (isProd) {
  app.use(helmet());
  app.use(hpp());
  app.set('trust proxy', true);
}

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Setting
app.use(
  cors({
    origin: isProd ? PROD_CONFIG.baseURL : true,
    credentials: true,
  }),
);

// Router List
app.use('/api-docs', docsRouter);

app.get('/', (_, res) => {
  res.status(200).send('NaYeongSeokGame Server has been Enabled.');
});

app.listen(CURRENT_CONFIG.port, () => {
  console.log(`server is running on ${CURRENT_CONFIG.port}`);
});

// Error Handler
app.use(errorHandler);
