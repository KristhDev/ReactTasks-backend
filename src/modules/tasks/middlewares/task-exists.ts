import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { Task } from '../../../database';

export const taskExists = async (req: Request, res: JsonResponse, next: NextFunction): Promise<JsonResponse | void> => {
    try {
        if (!(req as any).auth) return Http.unauthorized(res);

        const { taskId } = req.params;
        const { user } = (req as any).auth;

        const task = await Task.findOne({ _id: taskId, userId: user._id });

        if (!task) return Http.badRequest('La tarea no existe.', res);

        (req as any).task = task;
        return next();
    } 
    catch (error) {
        return Http.internalServerError(res, error as Error);
    }
}