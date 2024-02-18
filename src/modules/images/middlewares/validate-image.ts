import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Schemas */
import { imageSchema, ImageErrorMessages } from '@images';

/**
 * Validates an image received in a request.
 *
 * @param {Request} req - The request object.
 * @param {JsonResponse} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @return {JsonResponse|void} - The response object or void.
 */
export const validateImage = (req: Request, res: JsonResponse, next: NextFunction): JsonResponse | void => {
    const image = req.files?.image;

    if (!image) return next();
    if (Array.isArray(image)) return Http.badRequest(res, ImageErrorMessages.ONE_FILE);

    const result = imageSchema.safeParse(image);

    if (!result.success) {
        const error = result.error.errors[0].message;
        return Http.badRequest(res, error);
    }

    return next();
}