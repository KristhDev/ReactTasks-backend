import { User } from '@auth';
import { TaskModel } from '@database';

declare module 'express' {
    interface Request {
        auth?: {
            user: User;
            token: string;
        },
        task?: TaskModel;
        tokenExpiration?: string;
        user?: User;
    }
}