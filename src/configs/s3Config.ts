import AWS from 'aws-sdk';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_ID } = process.env;

const s3Storage: AWS.S3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_ID,
  region: 'ap-northeast-2',
});

export default s3Storage;
