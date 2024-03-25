import { UserType } from '@auth';
import { TaskModel } from '@database';

declare module 'express' {
    interface Request {
        auth?: {
            user: UserType;
            token: string;
        },
        task?: TaskModel;
        tokenExpiration?: string;
        user?: UserType;
    }
}