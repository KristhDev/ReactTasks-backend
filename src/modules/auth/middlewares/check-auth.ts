import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, JWT, JWTError, JWTErrorMessages } from '@auth';

/**
 * Checks if the request has a valid authorization token.
 *
 * @param {Request} req - The request object.
 * @param {JsonResponse} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<JsonResponse | void>} - The promise that resolves to a JSON response or void.
 */
export const checkAuth = async (req: Request, res: JsonResponse, next: NextFunction): Promise<JsonResponse | void> => {
    const token = (String(req.headers.authorization) || '').startsWith('Bearer ')
        ? (String(req.headers.authorization) || '').substring(7)
        : '';

    if (!token) return Http.unauthorized(res);

    try {
        const { id } = await JWT.validateToken<{ id: string }>(token);
        const user = await UserRepository.findById(id);

        if (!user) return Http.badRequest(res, AuthErrorMessages.NOT_FOUND);
        if (!user.verified) return Http.badRequest(res, AuthErrorMessages.UNVERIFIED);
        req.auth = { user, token }

        return next();
    } 
    catch (error) {
        if (error instanceof JWTError) {
            if (error.message !== JWTErrorMessages.EXPIRED) return Http.unauthorized(res, error as JWTError);
            return Http.sendResp(res, { msg: error.message, status: Http.UNAUTHORIZED });
        }

        return Http.internalServerError(res, error as Error);
    }
}
