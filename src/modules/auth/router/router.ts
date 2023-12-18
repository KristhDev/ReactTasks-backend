import { Router } from 'express';
// import { validateRequestBody } from 'zod-express-middleware';

/* Server */
import { validateRequest } from '../../../server';

/* Controllers */
import { SignUpController, SignInController } from '../controllers';

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

export default router;

