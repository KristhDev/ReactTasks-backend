import { Router } from 'express';

/* Controllers */
import { IndexController, ShowController } from '../controllers';

/* Middlewares */
import { checkAuth } from '../../auth';
import { taskExists } from '../middlewares';

/* Routes */
import { taskRoutes } from './routes';

const router = Router();

router.get(taskRoutes.INDEX, checkAuth, IndexController.handler);

router.get(taskRoutes.SHOW, checkAuth, taskExists, ShowController.handler);

export default router;