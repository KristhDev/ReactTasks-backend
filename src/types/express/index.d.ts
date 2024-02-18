import { TaskModel, UserModel } from '@database';

declare module 'express' {
    interface Request {
        auth?: {
            user: UserModel;
            token: string;
        },
        task?: TaskModel;
        tokenExpiration?: string;
        user?: UserModel;
    }
}