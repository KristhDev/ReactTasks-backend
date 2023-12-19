import { Document } from 'mongoose';

/* Interfaces */
import { ITask } from '../../../database';

export interface TaskEndpoint {
    id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    deadline: string;
    createdAt: string;
    updatedAt: string;
}

export type TaskModel = Document<unknown, {}, ITask> & ITask & Required<{ _id: string; }>;