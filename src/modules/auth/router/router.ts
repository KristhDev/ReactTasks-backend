import { Router } from 'express';

/* Server */
import { validateRequest } from '@server';

/* Middlewares */
import { checkAuth, checkAuthSecret, checkVerificationToken, userExists } from '../middlewares';

/* Controllers */
import {
    ChangePasswordController,
    ForgotPasswordController,
    RefreshAuthController,
    RemoveTokensController,
    RemoveVerificationsController,
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
    RefreshAuthController.handler
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
    usersRoutes.FORGOT_PASSWORD,
    (req, res, next) => validateRequest(req, res, next, EmailSchema),
    userExists,
    ForgotPasswordController.handler
);

router.put(
    usersRoutes.CHANGE_PASSWORD,
    checkAuth,
    (req, res, next) => validateRequest(req, res, next, PasswordSchema),
    ChangePasswordController.handler
);

router.post(
    usersRoutes.REMOVE_TOKENS,
    checkAuthSecret,
    RemoveTokensController.handler
);

router.post(
    usersRoutes.REMOVE_VERIFICATIONS,
    checkAuthSecret,
    RemoveVerificationsController.handler
);

export default router;