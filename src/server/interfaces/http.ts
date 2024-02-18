import { Response } from 'express';

export interface JsonBody {
    status: number;
    msg?: string;
    [key: string]: any;
}

export type JsonResponse = Response<JsonBody>;