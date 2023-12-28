import { Router } from 'express';

/* Middlewares */
import { checkAuth, checkVerificationToken, userExists } from '../middlewares';

/* Server */
import { validateRequest } from '../../../server';

/* Controllers */
import {
    RefreshAuth,
    SendEmailVerificationController,
    SignInController,
    SignOutController,
    SignUpController,
    VerifyEmailController
} from '../controllers';

/* Routes */
import { usersRoutes } from './routes';

/* Schemas */
import { EmailSchema, SignInSchema, SignUpSchema } from '../schemas';

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

router.get(
    usersRoutes.REFRESH,
    checkAuth,
    RefreshAuth.handler
);

router.post(
    usersRoutes.SIGN_OUT,
    checkAuth,
    SignOutController.handler
);

router.get(
    usersRoutes.VERIFY_EMAIL,
    checkVerificationToken,
    VerifyEmailController.handler
);

router.post(
    usersRoutes.VERIFY_EMAIL,
    (req, res, next) => validateRequest(req, res, next, EmailSchema),
    userExists,
    SendEmailVerificationController.handler
);

export default router;

