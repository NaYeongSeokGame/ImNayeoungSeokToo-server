import mongoose from 'mongoose';

import { DEV_CONFIG, PROD_CONFIG } from '@/constants/index';

const isProd: boolean = process.env.NODE_ENV === 'production';
const CURRENT_CONFIG = isProd ? PROD_CONFIG : DEV_CONFIG;

const connection = async () => {
  try {
    await mongoose.connect(CURRENT_CONFIG.mongoose.uri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
};

export default connection;
