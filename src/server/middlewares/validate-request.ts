import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/* Interfaces */
import { JsonResponse } from '../interfaces';

/* Utils */
import { Http } from '../utils';

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