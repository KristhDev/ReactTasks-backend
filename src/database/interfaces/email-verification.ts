import { Document } from 'mongoose';

export interface IEmailVerification {
    _id: string;
    userId: string;
    token: string;
    expiresIn: string;
    createdAt?: string;
    updatedAt?: string;
}

export type EmailVerificationModel = Document<unknown, {}, IEmailVerification> & IEmailVerification & Required<{ _id: string; }>;