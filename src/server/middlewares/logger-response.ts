import { Request, Response, NextFunction } from 'express';

/* Console */
import { Http, Logger } from '@server';

/**
 * Logs the response of an API request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {void} - The function does not return anything.
 */
export const loggerResponse = (req: Request, res: Response, next: NextFunction): void => {
    let userAgent = req.useragent?.source;

    if (req.useragent?.browser !== 'unknown') {
        userAgent = req.useragent?.browser;
        if (req.useragent?.version !== 'unknown') userAgent += ` ${ req.useragent?.version }`;
        if (req.useragent?.os !== 'unknown') userAgent += ` ${ req.useragent?.os }`;
        if (req.useragent?.platform !== 'unknown') userAgent += ` ${ req.useragent?.platform }`;
    }

    const originalSend = res.send;

    res.send = function (body) {
        let { status, msg } = JSON.parse(body);
        msg = `${ req.method } ${ req.originalUrl } IP ${ req.ip } ${ userAgent } Status ${ status } ${ msg }`;
        res = Object.assign(res, { bodyContent: { status, msg } });

        return originalSend.call(this, body);
    }

    res.on('finish', () => {
        const content = (res as any).bodyContent;

        if (content.status >= Http.OK && content.status < Http.BAD_REQUEST) Logger.success(content.msg);
        else Logger.error(content.msg);
    });

    next();
}