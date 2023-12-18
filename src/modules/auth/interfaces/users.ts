import { Document } from 'mongoose';

/* Interfaces */
import { IUser } from '../../../database';

export interface UserEndpoint {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export type UserModel = Document<unknown, {}, IUser> & IUser & Required<{ _id: string; }>;