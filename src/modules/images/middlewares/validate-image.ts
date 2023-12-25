import { NextFunction, Request } from 'express';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Schemas */
import { imageSchema } from '../schemas';

/**
 * Validates an image.
 *
 * @param {Request} req - the request object
 * @param {JsonResponse} res - the response object
 * @param {NextFunction} next - the next middleware function
 * @return {Promise<JsonResponse | void>} a promise that resolves to a JSON response or void
 */
export const validateImage = async (req: Request, res: JsonResponse, next: NextFunction): Promise<JsonResponse | void> => {
    try {
        const image = req.files?.image;
        if (!image) return next();

        if (Array.isArray(image)) return Http.badRequest('Solo puedes subir una imagen.', res);

        const result = imageSchema.safeParse(image);

        if (!result.success) {
            const error = result.error.errors[0].message;
            return Http.badRequest(error, res);
        }

        return next();
    } 
    catch (error) {
        return Http.internalServerError(res, error as Error);
    }
}