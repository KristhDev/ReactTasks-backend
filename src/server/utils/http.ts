import { Response } from 'express';

/* Console */
import { Logger } from '../console';

/* Interfaces */
import { JsonResponse } from '../interfaces';

/* Utils */
import { JWTError } from '../../modules/auth';

class Http {
    public static OK: number = 200;
    public static BAD_REQUEST: number = 400;
    public static UNAUTHORIZED: number = 401;
    public static NOT_FOUND: number = 404;
    public static INTERNAL_SERVER_ERROR: number = 500;

    /**
     * Sends a response with the specified data and status code.
     *
     * @param {Response} res - The response object.
     * @param {{ [key: string]: any, status: number }} data - The data to be sent in the response.
     * @return {JsonResponse} The JSON response.
     */
    public static sendResp(res: Response, data: { [key: string]: any, status: number }): JsonResponse {
        return res.status(data.status).json(data);
    }

    /**
     * Sends a bad request response with the given message.
     *
     * @param {string} msg - The error message.
     * @param {Response} res - The response object.
     * @return {JsonResponse} The JSON response object.
     */
    public static badRequest(msg: string, res: Response): JsonResponse {
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
        if (error) Logger.error(error.message);

        return res.status(this.UNAUTHORIZED).json({
            msg: 'Necesita ingresar para poder realizar está acción.',
            status: this.UNAUTHORIZED
        });
    }

    /**
     * Sends a JSON response with a 'not found' status and a message.
     *
     * @param {Response} res - The response object to send the JSON response.
     * @return {JsonResponse} The JSON response object.
     */
    public static notFound(res: Response): JsonResponse {
        return res.status(Http.NOT_FOUND).json({
            msg: 'Lo sentimos, pero no encontramos la página solicitada.',
            status: Http.NOT_FOUND
        });
    }

    /**
     * Generates a JSON response with an internal server error status.
     *
     * @param {Response} res - The response object.
     * @return {JsonResponse} The JSON response with the error message and status.
     */
    public static internalServerError(res: Response, error: Error): JsonResponse {
        Logger.error(error.message);

        return res.status(Http.INTERNAL_SERVER_ERROR).json({
            msg: 'Ocurrio un error inesperado. Intente de nuevo más tarde.',
            status: Http.INTERNAL_SERVER_ERROR
        });
    }
}

export default Http;