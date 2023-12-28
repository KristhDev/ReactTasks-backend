import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { UserRepository } from '../../../database';

/**
 * Checks if a user exists.
 *
 * @param {Request} req - The request object.
 * @param {JsonResponse} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<JsonResponse | void>} A promise that resolves to a JSON response or void.
 */
export const userExists = async (req: Request, res: JsonResponse, next: NextFunction): Promise<JsonResponse | void> => {
    try {
        const { email } = req.body;

        const user = await UserRepository.findOne({ email });
        if (!user) return Http.badRequest(res, 'El usuario no existe.');

        req.user = user;

        return next();
    } 
    catch (error) {
        return Http.internalServerError(res, error as Error);
    }
}