import dotenv from 'dotenv';

dotenv.config();

export const DEV_CONFIG = {
  mode: 'dev',
  port: '4000',
  baseURL: 'http://localhost:3000',
  socialAuthURL: 'http://localhost:3000/auth',
  db: {
    port: '3306',
    database: 'kuagora-dev',
  },
  redis: {
    host: process.env.DEV_REDIS_HOST,
    password: process.env.DEV_REDIS_PASSWORD,
    username: process.env.DEV_REDIS_USERNAME,
    port: '14828',
  },
} as const;

export const PROD_CONFIG = {
  mode: 'dev',
  port: '8000',
  baseURL: 'http://kuagora.app',
  socialAuthURL: 'http://kuagora.app/auth',
  db: {
    port: '3306',
    database: 'kuagora',
  },
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    port: '14828',
  },
} as const;
