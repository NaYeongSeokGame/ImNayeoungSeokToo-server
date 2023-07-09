import { S3 } from 'aws-sdk';
import fs from 'fs';

import s3Storage from '@/configs/s3Config';
import { InternalServerError } from '@/utils/definedErrors';

class S3StorageModule {
  static async uploadFileToS3({
    fileData,
    presetPin,
  }: {
    fileData: Express.Multer.File;
    presetPin: string;
  }): Promise<string> {
    try {
      // TODO : req.files 에서 읽은 Multer File이 아닌, sharp로 변환된 파일을 읽도록 해야 함
      const originFileName = `${fileData.originalname.split(".")[0]}.webp`
      const fileContent: Buffer = fs.readFileSync(`uploads/${originFileName}`);

      const params: S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: `preset/${presetPin}/${originFileName}`,
        Body: fileContent,
      };

      const result = await s3Storage.upload(params).promise();
      if (!result)
        throw new InternalServerError(
          'S3 버킷에 파일을 업로드하는 과정에서 문제가 생겼습니다.',
        );

      await new Promise((resolve, reject) => {
        fs.unlink(`uploads/${originFileName}`, (error) => {
            return error ? reject(error) : resolve('success');
        })
      });

      const cloudFrontUrl = `${process.env.CLOUDFRONT_URL}/preset/${presetPin}/${originFileName}`;
      return cloudFrontUrl;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async deleteFileFromS3(key: string) {
    try {
      const params: S3.DeleteObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key.replace(`${process.env.CLOUDFRONT_URL}/`, ''),
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
