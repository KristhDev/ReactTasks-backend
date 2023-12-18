import { Router } from 'express';

/* Middlewares */
import { checkAuth } from '../middlewares';

/* Server */
import { validateRequest } from '../../../server';

/* Controllers */
import { SignUpController, SignInController, SignOutController } from '../controllers';

/* Routes */
import { usersRoutes } from './routes';

/* Schemas */
import { SignInSchema, SignUpSchema } from '../schemas';

const router = Router();

router.post(
    usersRoutes.SIGN_UP,
    (req, res, next) => validateRequest(req, res, next, SignUpSchema), 
    SignUpController.handler
);

router.post(
    usersRoutes.SIGN_IN,
    (req, res, next) => validateRequest(req, res, next, SignInSchema), 
    SignInController.handler
);

router.post(
    usersRoutes.SIGN_OUT,
    checkAuth,
    SignOutController.handler
);

export default router;

