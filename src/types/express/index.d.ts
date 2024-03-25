import { User } from '@auth';
import { Task } from '@tasks';

declare module 'express' {
    interface Request {
        auth?: {
            user: User;
            token: string;
        },
        task?: Task;
        tokenExpiration?: string;
        user?: User;
    }
}