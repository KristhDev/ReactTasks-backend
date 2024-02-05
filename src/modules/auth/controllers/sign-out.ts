import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Auth */
import { JWT } from '@auth';

class SignOutController {
    /**
     * Handles the request to revoke a token and send the response.
     *
     * @param {Request} req - the request object
     * @param {JsonResponse} res - the response object
     * @return {Promise<JsonResponse>} a promise that resolves to the response object
     */
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { token } = req.auth!;
            await JWT.revokeToken(token);

            return Http.sendResp(res, {
                msg: 'Has cerrado sesión correctamente.',
                status: Http.OK
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SignOutController;