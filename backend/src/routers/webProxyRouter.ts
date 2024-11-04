import { Router } from 'express';
import { requestWebContent } from '../controllers/webProxyController';

const webProxyRouter: Router = Router();

webProxyRouter.get('/', requestWebContent);

export default webProxyRouter;
