import { Router } from 'express';

/* Controllers */
import { IndexController } from '../controllers';

/* Middlewares */
import { checkAuth } from '../../auth';

const router = Router();

router.get('/', checkAuth, IndexController.handler);

export default router;