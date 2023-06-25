import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

export type TUpload =
  | {
      [fieldname: string]: Express.Multer.File[] | Express.MulterS3.File[];
    }
  | Express.Multer.File[]
  | Express.MulterS3.File[];

// 업로드 가능한 최대 파일 크기 (10MB)
const MAX_SIZE = 1024 * 1024 * 10;
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_ID, S3_BUCKET_NAME } = process.env;

// 리전 업데이트 (서울)
aws.config.update({ region: 'ap-northeast-2' });

export const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_ID,
});

export const s3Upload = (files: TUpload): Promise<unknown> => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let index = 0; index < files.length; index++) {
        const params = {
          Bucket: S3_BUCKET_NAME as string,
          Body: files[index].buffer,
          Key: 'dd',
        };
        s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err);
            return;
          }
          if (data === undefined) {
            reject(new Error('file is not uploaded'));
            return;
          }
          resolve(true);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
