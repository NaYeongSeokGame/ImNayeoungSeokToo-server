import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import sharp from 'sharp';

/**
 * multer로 받은 이미지 파일을 리사이즈 하여 용량을 줄이는 미들웨어 resizeImage
 */
const midResizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // NOTE : 요청에 파일이 없다면 다음 미들웨어로 통과시킨다.
  if (!req.files) next();

  const imageFiles = req.files as Express.Multer.File[];

  // NOTE : 가로 혹은 세로의 길이를 300px 로 고정시킨다. (비례 축소)
  const MAX_LENGTH = 300; 
  try {
    await Promise.all(
      imageFiles.map(async (imageFile) => {
        const fileContent: Buffer = fs.readFileSync(imageFile.path);

        const originFileName = imageFile.originalname.split(".")[0]
        const { width, height } = await sharp(fileContent).metadata();
        const [smallerWidth, smallerHeight] = [width, height].map((length) =>
          Math.round(Math.min(length ?? MAX_LENGTH, MAX_LENGTH)),
        );

        // NOTE : sharp 라이브러리를 활용하여 확장자를 webp로 변환 및 사이즈 축소
        await sharp(fileContent)
          .withMetadata()
          .resize(smallerWidth, smallerHeight, {
            fit: 'outside',
            position: 'top',
          })
          .toFormat('webp', { quality: 100 })
          .toFile(`uploads/${originFileName}.webp`);
        
        // NOTE : 기존에 저장해두었던 원본 파일은 fs.unlink 를 사용하여 제거
        await new Promise((resolve, reject) => {
            fs.unlink(`${imageFile.path}`, (error) => {
               return error ? reject(error) : resolve('success');
            })
        });

        next();
      }),
    );
  } catch (err) {
    next(err);
  }
};

export default midResizeImage;
