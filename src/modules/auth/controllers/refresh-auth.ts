import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { UserRepository } from '../../../database';

/* Utils */
import { JWT } from '../utils';

class RefreshAuth {
    /**
     * Handles the request and generates a new token for the user.
     *
     * @param {Request} req - the request object
     * @param {JsonResponse} res - the response object
     * @return {Promise<JsonResponse>} - the modified response object
     */
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { token, user } = req.auth!;

            const newToken = JWT.generateToken({ id: user._id });
            await JWT.revokeToken(token);

            return Http.sendResp(res, {
                status: Http.OK,
                user: UserRepository.endpointAdapter(user),
                token: newToken
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default RefreshAuth;