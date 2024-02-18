/* Database */
import { TaskStatus } from '@database';

export interface TaskEndpoint {
    id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    deadline: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}