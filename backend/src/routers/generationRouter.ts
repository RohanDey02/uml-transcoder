import { Router } from 'express';
import { generateAIResponse } from '../controllers/generationController';

const generationRouter: Router = Router();

generationRouter.post('/', generateAIResponse);

export default generationRouter;
