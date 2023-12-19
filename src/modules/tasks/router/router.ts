import { Router } from 'express';

/* Controllers */
import { IndexTaskController, ShowTaskController, StoreTaskController } from '../controllers';

/* Middlewares */
import { checkAuth } from '../../auth';
import { validateRequest } from '../../../server';
import { taskExists } from '../middlewares';

/* Routes */
import { taskRoutes } from './routes';

/* Schemas */
import { storeTaskSchema } from '../schemas';

const router = Router();

router.get(
    taskRoutes.INDEX,
    checkAuth,
    IndexTaskController.handler
);

router.post(
    taskRoutes.STORE,
    checkAuth,
    (req, res, next) => validateRequest(req, res, next, storeTaskSchema),
    StoreTaskController.handler
);

router.get(
    taskRoutes.SHOW,
    checkAuth,
    taskExists,
    ShowTaskController.handler
);

export default router;