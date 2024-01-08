import { Request } from 'express';
import { z } from 'zod';

import { EmailSchema, PasswordSchema, SignInSchema, SignUpSchema, UserSchema } from '../schemas';

export type SignInBody = z.infer<typeof SignInSchema>;
export type SignInRequest = Request<any, any, SignInBody>

export type SignUpBody = z.infer<typeof SignUpSchema>;
export type SignUpRequest = Request<any, any, SignUpBody>;

export type VerifyEmailRequest = Request<any, any, any, { token?: string }>;

export type SendEmailVerificationController = z.infer<typeof EmailSchema>;
export type SendEmailVerificationRequest = Request<any, any, SendEmailVerificationController>;

export type ChangePasswordBody = z.infer<typeof PasswordSchema>;
export type ChangePasswordRequest = Request<any, any, ChangePasswordBody>;

export type UpdateUserBody = z.infer<typeof UserSchema>;
export type UpdateUserRequest = Request<any, any, UpdateUserBody>;