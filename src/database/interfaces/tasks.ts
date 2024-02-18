import { Document } from 'mongoose';

export interface ITask {
    _id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    deadline: string;
    status: TaskStatus;
    createdAt?: string;
    updatedAt?: string;
}

export type TaskModel = Document<unknown, {}, ITask> & ITask & Required<{ _id: string; }>;
export type TaskStatus = 'pending' | 'completed' | 'in-progress';