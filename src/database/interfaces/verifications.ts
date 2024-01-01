import { Document } from 'mongoose';

export interface IVerification {
    _id: string;
    userId: string;
    token: string;
    type: 'email' | 'password';
    expiresIn: string;
    createdAt?: string;
    updatedAt?: string;
}

export type VerificationModel = Document<unknown, {}, IVerification> & IVerification & Required<{ _id: string; }>;