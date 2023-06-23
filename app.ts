import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { createConnection } from 'typeorm';

import docsRouter from '@/routes/docs';

import { DEV_CONFIG, PROD_CONFIG } from '@/constants/index';
import typeOrmConfig from '@/database/config/ormconfig';
import errorHandler from '@/errors/errorHandler';

dotenv.config();

const isProd: boolean = process.env.NODE_ENV === 'production';
const CURRENT_CONFIG = isProd ? PROD_CONFIG : DEV_CONFIG;

// DB Connection
createConnection(typeOrmConfig[CURRENT_CONFIG.mode]).then(() => {
  console.log('Successfully connected to DB.');
});

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
app.use('/auth', authRouter);
app.use('/question', questionRouter);
app.use('/search', searchRouter);

app.get('/', (_, res) => {
  res.status(200).send('KUAGORA Server has been Enabled.');
});

app.listen(CURRENT_CONFIG.port, () => {
  console.log(`server is running on ${CURRENT_CONFIG.port}`);
});

// Error Handler
app.use(errorHandler);
