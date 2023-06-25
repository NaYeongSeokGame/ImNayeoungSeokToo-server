import { Request } from 'express';
import multer from 'multer';

type FileNameCallbackFunc = (error: Error | null, filename: string) => void;

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
};
