import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/**
 * Checks the authorization secret from the request headers and calls the next function if the secret is valid.
 *
 * @param {Request} req - the request object
 * @param {JsonResponse} res - the JSON response object
 * @param {NextFunction} next - the next function to be called
 * @return {Promise<JsonResponse | void>} returns a JSON response or void
 */
export const checkAuthSecret = async (req: Request, res: JsonResponse, next: NextFunction): Promise<JsonResponse | void> => {
    const authSecret = (String(req.headers.authorization) || '').startsWith('Bearer ')
        ? (String(req.headers.authorization) || '').substring(7)
        : '';

    if (!authSecret) return Http.notFound(res);
    if (authSecret !== process.env.AUTH_SECRET) return Http.notFound(res);

    return next();
}