import { NextFunction, Request } from 'express';
/* Server */
import { Http, JsonResponse, Logger } from '../../../server';

/* Utils */
import { JWT } from '../utils';

/**
 * Checks the verification token provided in the request query.
 *
 * @param {Request} req - The request object.
 * @param {JsonResponse} res - The JSON response object.
 * @param {NextFunction} next - The next function.
 * @return {JsonResponse | void} Returns a JSON response or void.
 */
export const checkVerificationToken = (req: Request, res: JsonResponse, next: NextFunction): JsonResponse | void => {
    try {
        const { token } = req.query;
        if (!token) return Http.badRequest(res, 'La verificación no puede ser procesada.');

        const data = JWT.decodeToken(token as string);
        if (!data) return Http.badRequest(res, 'La verificación no puede ser procesada.');

        (req as any).tokenExpiration = new Date(data.exp! * 1000).toISOString();

        return next();
    } 
    catch (error) {
        Logger.error((error as Error).message);
        return Http.badRequest(res, 'La verificación no puede ser procesada.');
    }
}