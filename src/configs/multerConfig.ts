import { Request } from 'express';
import multer from 'multer';

type FileNameCallbackFunc = (error: Error | null, filename: string) => void;

/**
 * 파일 갯수 제한 : 9개, 파일 당 사이즈 제한 : UNDER 10MB
 */
// const MAX_COUNT = 9;
const MAX_SIZE = 1024 * 1024 * 10;

/**
 * Express의 Request body 에 존재하는 파일을 읽어 저장하도록 하는 Config
 * destination 옵션에 정의된 경로에 파일을 저장하며, callback을 통해 파일의 이름으로 저장한다.
 */
export const multerConfig: multer.Options = {
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (
      req: Request,
      file: Express.Multer.File,
      callback: FileNameCallbackFunc,
    ) {
      callback(null, file.originalname);
    },
  }),
  limits: {
    fileSize: MAX_SIZE,
  },
  // sharp 에서 지원하는 파일 확장자 (jpeg, png, webp, avif, tiff) 만 허용
  fileFilter: (req, file, callback) => {
    callback(
      null,
      file.mimetype.match(/(image\/(jpeg|png|webp|avif|tiff))/)?.length !== 0,
    );
  },
};
