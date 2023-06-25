import multer from 'multer';

class MulterHandler {
  static async upload() {
    return multer({}).array('images');
  }
}
