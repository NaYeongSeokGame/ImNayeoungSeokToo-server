import { S3 } from 'aws-sdk';
import fs from 'fs';

import s3Storage from '@/configs/s3Config';

class S3StorageModule {
  static async uploadFileToS3({
    fileData,
    presetPin,
  }: {
    fileData: Express.Multer.File;
    presetPin: string;
  }): Promise<string> {
    try {
      const fileContent: Buffer = fs.readFileSync(fileData.path);

      const params: S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: `preset/${presetPin}/${fileData.originalname}`,
        Body: fileContent,
      };

      const result = await s3Storage.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async deleteFileFromS3(key: string) {
    try {
      const params: S3.DeleteObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key,
      };
      const result = await s3Storage.deleteObject(params).promise();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default S3StorageModule;
