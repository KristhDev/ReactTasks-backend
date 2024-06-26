/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, ChangePasswordRequest, Encrypt, JWT } from '@auth';

class ChangePasswordController {
    /**
     * Handles the request for changing the user's password.
     *
     * @param {ChangePasswordRequest} req - the request object containing the password to be changed
     * @param {JsonResponse} res - the response object to send the result of the password change
     * @return {Promise<JsonResponse>} - a promise that resolves with the response object containing the result of the password change
     */
    public static async handler(req: ChangePasswordRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { password, revokeToken } = req.body;
            const { user, token } = req.auth!;

            const match = Encrypt.compareHash(password, user?.password!);
            if (match) return Http.badRequest(res, AuthErrorMessages.NEW_PASSWORD);

            const hash = Encrypt.createHash(password);
            await UserRepository.findByIdAndUpdate(user.id, { password: hash });

            if (revokeToken) await JWT.revokeToken(token);

            return Http.sendResp(res, {
                msg: 'Has cambiado tu contraseña correctamente.',
                status: Http.OK
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ChangePasswordController;