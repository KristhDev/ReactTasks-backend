import { Request } from 'express';
import { z } from 'zod';

/* Schemas */
import { statusTaskSchema, storeTaskSchema, updateTaskSchema } from '../schemas';

export type IndexTaskRequest = Request<any, any, any, { query?: string, page?: number }>;

export type StoreTaskBody = z.infer<typeof storeTaskSchema>;
export type StoreTaskRequest = Request<any, any, StoreTaskBody>;

export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
export type UpdateTaskRequest = Request<any, any, UpdateTaskBody>;

export type ChangeStatusTaskBody = z.infer<typeof statusTaskSchema>;
export type ChangeStatusTaskRequest = Request<any, any, ChangeStatusTaskBody>;