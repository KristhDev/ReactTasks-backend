import { Router } from 'express';

/* Server */
import { validateRequest } from '@server';

/* Middlewares */
import { checkAuth, checkVerificationToken, userExists } from '../middlewares';

/* Controllers */
import {
    ChangePasswordController,
    RefreshAuth,
    ResetPasswordController,
    SendEmailVerificationController,
    SignInController,
    SignOutController,
    SignUpController,
    UpdateUserController,
    VerifyEmailController
} from '../controllers';

/* Routes */
import { usersRoutes } from './routes';

/* Schemas */
import { EmailSchema, PasswordSchema, SignInSchema, SignUpSchema, UserSchema } from '../schemas';

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

router.put(
    usersRoutes.UPDATE_USER,
    checkAuth,
    (req, res, next) => validateRequest(req, res, next, UserSchema),
    UpdateUserController.handler
);

router.post(
    usersRoutes.RESET_PASSWORD,
    (req, res, next) => validateRequest(req, res, next, EmailSchema),
    userExists,
    ResetPasswordController.handler
);

router.put(
    usersRoutes.CHANGE_PASSWORD,
    checkAuth,
    (req, res, next) => validateRequest(req, res, next, PasswordSchema),
    ChangePasswordController.handler
);

export default router;

