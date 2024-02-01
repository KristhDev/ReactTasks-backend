import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { TaskRepository } from '../../../database';

/* Utils */
import { TaskErrorMessages } from '../utils';

/**
 * Checks if a task exists.
 *
 * @param {Request} req - the request object
 * @param {JsonResponse} res - the response object
 * @param {NextFunction} next - the next middleware function
 * @returns {Promise<JsonResponse | void>} - a promise that resolves to a JSON response or void
 */
export const taskExists = async (req: Request, res: JsonResponse, next: NextFunction): Promise<JsonResponse | void> => {
    try {
        if (!req.auth) return Http.unauthorized(res);

        const { taskId } = req.params;
        const { user } = req.auth;

        const task = await TaskRepository.findOne({ _id: taskId, userId: user._id });
        if (!task) return Http.badRequest(res, TaskErrorMessages.NOT_FOUND);

        req.task = task;
        return next();
    } 
    catch (error) {
        return Http.internalServerError(res, error as Error);
    }
}