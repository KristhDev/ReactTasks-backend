import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TokenRepository } from '@database';

class RemoveTokensController {
    /**
     * This function handles the request and response for token expiration cleanup.
     *
     * @param {Request} req - the request object
     * @param {JsonResponse} res - the JSON response object
     * @return {Promise<JsonResponse>} a promise of the JSON response
     */
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const currentDate = new Date().toISOString();
            await TokenRepository.deleteLastExpired(currentDate);

            return Http.sendResp(res, {
                msg: 'Se eliminaron todos los tokens expirados correctamente.',
                status: Http.OK,
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default RemoveTokensController;