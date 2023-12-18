import { Router } from 'express';
// import { validateRequestBody } from 'zod-express-middleware';

/* Server */
import { validateRequest } from '../../../server';

/* Controllers */
import { SignUpController } from '../controllers';

/* Routes */
import { usersRoutes } from './routes';

/* Schemas */
import { SignUpSchema } from '../schemas';

const router = Router();

router.post(
    usersRoutes.SIGN_UP,
    (req, res, next) => validateRequest(req, res, next, SignUpSchema), 
    SignUpController.handler
);

export default router;

