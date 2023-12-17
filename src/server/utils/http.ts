import { Response } from 'express';

/* Interfaces */
import { JsonResponse } from '../interfaces';

class Http {
    public static OK: number = 200;
    public static BAD_REQUEST: number = 400;
    public static NOT_FOUND: number = 404;
    public static INTERNAL_SERVER_ERROR: number = 500;

    /**
     * Sends a response with the provided message, status code, and response object.
     *
     * @param {string} msg - The message to include in the response.
     * @param {number} status - The status code to set for the response.
     * @param {Response} res - The response object to send the response on.
     * @return {JsonResponse} The JSON response object.
     */
    public static sendResp(msg: string, status: number, res: Response): JsonResponse {
        return res.status(status).json({ msg, status });
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
    public static internalServerError(res: Response): JsonResponse {
        return res.status(Http.INTERNAL_SERVER_ERROR).json({
            msg: 'Ocurrio un error inesperado. Intente de nuevo más tarde.',
            status: Http.INTERNAL_SERVER_ERROR
        });
    }
}

export default Http;