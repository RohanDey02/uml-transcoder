import { Router } from 'express';
import { getLocalImage, wipeUploadsDir } from '../controllers/uploadsController';

const uploadsRouter: Router = Router();

uploadsRouter.get('/', getLocalImage);

uploadsRouter.delete('/', wipeUploadsDir);

export default uploadsRouter;
