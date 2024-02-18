import { Request, Response, NextFunction } from 'express';

/*  Server */
import { Http, Logger } from '@server';

/**
 * Logs the request and response information, and modifies the response object to include additional content before sending the response.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next middleware function
 * @return {void} 
 */
export const loggerReqRes = (req: Request, res: Response, next: NextFunction): void => {
    let userAgent = req.useragent?.source;

    if (req.useragent?.browser !== 'unknown') {
        userAgent = req.useragent?.browser;
        if (req.useragent?.version !== 'unknown') userAgent += ` ${ req.useragent?.version }`;
        if (req.useragent?.os !== 'unknown') userAgent += ` ${ req.useragent?.os }`;
        if (req.useragent?.platform !== 'unknown') userAgent += ` ${ req.useragent?.platform }`;
    }

    Logger.info(`${ req.method } ${ req.path } IP ${ req.ip } ${ userAgent }`);

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

        Logger.uploadLogs();
    });

    return next();
}