import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/* Interfaces */
import { JsonResponse } from '../interfaces';

/* Utils */
import { Http } from '../utils';

/**
 * Validates a request against a schema and handles the response accordingly.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @param {z.ZodEffects<z.ZodObject<any>> | z.ZodObject<any>} schema - The schema to validate against.
 * @return {Promise<JsonResponse | void>} - A promise that resolves to a JSON response or void.
 */
export const validateRequest = async (
    req: Request,
    res: Response, 
    next: NextFunction, schema: z.ZodEffects<z.ZodObject<any>> | z.ZodObject<any>
): Promise<JsonResponse | void> => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
        const error = result.error.errors[0].message;
        return Http.badRequest(error, res);
    }

    next();
}