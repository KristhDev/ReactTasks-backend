import { Request, RequestHandler, Router } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { VerificationRepository } from '@database';

class RemoveVerificationsController {
    /**
     * An asynchronous function that handles the request and response objects, deletes expired verifications, 
     * and sends a response accordingly.
     *
     * @param {Request} req - the request object
     * @param {JsonResponse} res - the JSON response object
     * @return {Promise<JsonResponse>} a promise that resolves to a JSON response
     */
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const currentDate = new Date().toISOString();
            await VerificationRepository.deleteMany({ expiresIn: { $lte: currentDate } });

            return Http.sendResp(res, {
                msg: 'Se eliminaron todas las verificaciones expiradas correctamente.',
                status: Http.OK,
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default RemoveVerificationsController;