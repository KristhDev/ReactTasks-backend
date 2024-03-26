import { Task } from '@tasks';
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

export interface CreateTaskData {
    userId: string;
    title: string;
    description: string;
    deadline: string;
    status?: TaskStatus;
    image?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    deadline?: string;
    status?: TaskStatus;
    image?: string;
}

export interface TaskFilter {
    id?: string;
    userId?: string;
    title?: string;
    description?: string;
    image?: string;
    deadline?: string;
    status?: TaskStatus;
    [key: string]: any;
}

export interface TaskPaginateOptions {
    limit: number;
    page: number;
    query?: TaskFilter;
    sort?: { [key: string]: number };
}

export interface TasksPaginated {
    tasks: Task[];
    pagination: {
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        nextPage: number;
        totalPages: number;
    }
}