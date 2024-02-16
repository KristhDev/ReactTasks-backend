import { Request, Response, NextFunction } from 'express';

/* Console */
import { Logger } from '@server';

/**
 * Middleware function that logs incoming requests.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next function to execute.
 * @returns {void} - The function does not return anything.
 */
export const loggerRequest = (req: Request, res: Response, next: NextFunction): void => {
    let userAgent = req.useragent?.source;

    if (req.useragent?.browser !== 'unknown') {
        userAgent = req.useragent?.browser;
        if (req.useragent?.version !== 'unknown') userAgent += ` ${ req.useragent?.version }`;
        if (req.useragent?.os !== 'unknown') userAgent += ` ${ req.useragent?.os }`;
        if (req.useragent?.platform !== 'unknown') userAgent += ` ${ req.useragent?.platform }`;
    }

    Logger.info(`${ req.method } ${ req.path } IP ${ req.ip } ${ userAgent }`);

    next();
}