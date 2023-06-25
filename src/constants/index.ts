import dotenv from 'dotenv';

dotenv.config();

export const DEV_CONFIG = {
  mode: 'dev',
  port: '4000',
  baseURL: 'http://localhost:3000',
  mongoose: {
    uri: process.env.DEV_MONGO_URI || '',
  },
} as const;

export const PROD_CONFIG = {
  mode: 'dev',
  port: '8000',
  baseURL: 'http://ec2-43-202-28-155.ap-northeast-2.compute.amazonaws.com/',
  mongoose: {
    uri: process.env.PROD_MONGO_URI || '',
  },
} as const;
