import { Document } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    lastname: string;
    email: string;
    verified: boolean;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type UserModel = Document<unknown, {}, IUser> & IUser & Required<{ _id: string; }>;

export interface CreateUserData {
    name: string;
    lastname: string;
    email: string;
    password: string;
    verified?: boolean;
}

export interface UpdateUserData {
    name?: string;
    lastname?: string;
    password?: string;
    verified?: boolean;
}

export interface UserFilter {
    id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    verified?: boolean;
    password?: string;
}