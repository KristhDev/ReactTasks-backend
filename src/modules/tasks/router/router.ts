import { Router } from 'express';

/* Controllers */
import {
    DestroyTaskController,
    IndexTaskController,
    ShowTaskController,
    StoreTaskController,
    UpdateTaskController
} from '../controllers';

/* Middlewares */
import { checkAuth } from '../../auth';
import { validateRequest } from '../../../server';
import { validateImage } from '../../images';
import { taskExists } from '../middlewares';

/* Routes */
import { taskRoutes } from './routes';

/* Schemas */
import { storeTaskSchema, updateTaskSchema } from '../schemas';

const router = Router();

router.use(checkAuth);

router.get(
    taskRoutes.INDEX,
    IndexTaskController.handler
);

router.post(
    taskRoutes.STORE,
    (req, res, next) => validateRequest(req, res, next, storeTaskSchema),
    validateImage,
    StoreTaskController.handler
);

router.get(
    taskRoutes.SHOW,
    taskExists,
    ShowTaskController.handler
);

router.put(
    taskRoutes.UPDATE,
    taskExists,
    (req, res, next) => validateRequest(req, res, next, updateTaskSchema),
    validateImage,
    UpdateTaskController.handler
);

router.delete(
    taskRoutes.DELETE,
    taskExists,
    DestroyTaskController.handler
)

export default router;