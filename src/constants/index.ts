import dotenv from 'dotenv';

dotenv.config();

export const DEV_CONFIG = {
  mode: 'dev',
  port: '4000',
  baseURL: 'http://localhost:3000',
  mongoose: {
    port: 1337,
    db: 'mongodb://localhost:27017/rest-api-tutorial',
  },
} as const;

export const PROD_CONFIG = {
  mode: 'dev',
  port: '8000',
  baseURL: 'http://nayeongseokgame.app',
  mongoose: {
    port: 1337,
    db: 'mongodb://localhost:27017/rest-api-tutorial',
  },
} as const;
