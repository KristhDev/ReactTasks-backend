import { Request, Response, NextFunction } from 'express';

/*  Server */
import { Logger } from '@server';

/**
 * Logs information about the incoming request, including method, path, IP, and user agent.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function to be called
 * @return {void} 
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

    return next();
}