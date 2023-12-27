import { Document } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    verified: boolean;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type UserModel = Document<unknown, {}, IUser> & IUser & Required<{ _id: string; }>;