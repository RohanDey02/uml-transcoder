import { Router } from 'express';
import { uploadFile, wipeUploadsDir } from '../controllers/uploadsController';
import multer from 'multer';
import { randomUUID } from 'crypto';

const uploadsRouter: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${randomUUID()}.${fileExtension}`);
  }
});

const upload = multer({ storage });

uploadsRouter.post('/', upload.single('file'), uploadFile);

uploadsRouter.delete('/', wipeUploadsDir);

export default uploadsRouter;
