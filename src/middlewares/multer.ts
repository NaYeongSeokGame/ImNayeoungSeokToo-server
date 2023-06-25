import multer from 'multer';

import { multerConfig } from '@/configs/multerConfig';

const upload = multer(multerConfig);

export default upload;
