import { Request } from 'express';
import { z } from 'zod';

import { EmailSchema, SignInSchema, SignUpSchema } from '../schemas';

export type SignInBody = z.infer<typeof SignInSchema>;
export type SignInRequest = Request<any, any, SignInBody>

export type SignUpBody = z.infer<typeof SignUpSchema>;
export type SignUpRequest = Request<any, any, SignUpBody>;

export type VerifyEmailRequest = Request<any, any, any, { token?: string }>;

export type SendEmailVerificationController = z.infer<typeof EmailSchema>;
export type SendEmailVerificationRequest = Request<any, any, SendEmailVerificationController>