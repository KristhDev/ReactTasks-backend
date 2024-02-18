import { Request, Response } from 'express';

/* Server */
import { Logger, JsonResponse, ServerErrorMessages, JsonBody } from '@server';

/* Auth */
import { AuthErrorMessages, JWTError } from '@auth';

class Http {
    public static OK: number = 200;
    public static CREATED: number = 201;
    public static BAD_REQUEST: number = 400;
    public static UNAUTHORIZED: number = 401;
    public static NOT_FOUND: number = 404;
    public static INTERNAL_SERVER_ERROR: number = 500;

    /**
     * Logs the response and uploads the logs.
     *
     * @param {Request} req - the request object
     * @param {JsonBody} data - the response data
     * @return {void} 
     */
    private static loggerResponse(req: Request, data: JsonBody): void {
        let userAgent = req.useragent?.source;

        if (req.useragent?.browser !== 'unknown') {
            userAgent = req.useragent?.browser;
            if (req.useragent?.version !== 'unknown') userAgent += ` ${ req.useragent?.version }`;
            if (req.useragent?.os !== 'unknown') userAgent += ` ${ req.useragent?.os }`;
            if (req.useragent?.platform !== 'unknown') userAgent += ` ${ req.useragent?.platform }`;
        }

        const msg = `${ req.method } ${ req.originalUrl } IP ${ req.ip } ${ userAgent } Status ${ data.status } ${ data?.msg }`;

        if (data.status >= Http.OK && data.status < Http.BAD_REQUEST) Logger.success(msg);
        else Logger.error(msg);

        Logger.uploadLogs();
    }

    /**
     * Sends a response with the specified data and status code.
     *
     * @param {Response} res - The response object.
     * @param {{ [key: string]: any, status: number }} data - The data to be sent in the response.
     * @return {JsonResponse} The JSON response.
     */
    public static sendResp(res: Response, data: { [key: string]: any, status: number }): JsonResponse {
        Http.loggerResponse(res.req, data);
        return res.status(data.status).json(data);
    }

    /**
     * Sends a bad request response with the given message.
     *
     * @param {Response} res - The response object.
     * @param {string} msg - The error message.
     * @return {JsonResponse} The JSON response object.
     */
    public static badRequest(res: Response, msg: string): JsonResponse {
        Http.loggerResponse(res.req, { msg, status: Http.BAD_REQUEST });
        return res.status(Http.BAD_REQUEST).json({ msg, status: Http.BAD_REQUEST });
    }

    /**
     * Generates a JSON response with an unauthorized status code and error message.
     *
     * @param {Response} res - The response object to send the JSON response.
     * @param {JWTError} [error] - An optional JWTError object representing the error that occurred.
     * @return {JsonResponse} The JSON response with the unauthorized status code and error message.
     */
    public static unauthorized(res: Response, error?: JWTError): JsonResponse {
        if (error) Logger.error(`${ error.name }: ${ error.message }`);

        const data = {
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: this.UNAUTHORIZED
        }

        Http.loggerResponse(res.req, data);
        return res.status(this.UNAUTHORIZED).json(data);
    }

    /**
     * Sends a JSON response with a 'not found' status and a message.
     *
     * @param {Response} res - The response object to send the JSON response.
     * @param {string} [msg] - An optional message to include in the response.
     * @return {JsonResponse} The JSON response object.
     */
    public static notFound(res: Response, msg?: string): JsonResponse {
        const data = {
            msg: msg || ServerErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        }

        Http.loggerResponse(res.req, data);
        return res.status(Http.NOT_FOUND).json(data);
    }

    /**
     * Generates a JSON response with an internal server error status.
     *
     * @param {Response} res - The response object.
     * @return {JsonResponse} The JSON response with the error message and status.
     */
    public static internalServerError(res: Response, error: Error): JsonResponse {
        Logger.error(`${ error.name }: ${ error.message }`);

        const data = {
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        }

        Http.loggerResponse(res.req, data);
        return res.status(Http.INTERNAL_SERVER_ERROR).json(data);
    }
}

export default Http;