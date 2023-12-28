import { TaskModel, UserModel } from '../../../database';

declare global {
    namespace Express {
        export interface Request {
            auth?: {
                user: UserModel;
                token: string;
            },
            task?: TaskModel;
            tokenExpiration?: string;
            user?: UserModel;
        }
    }
}