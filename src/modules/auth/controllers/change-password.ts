import bcrypt from 'bcryptjs';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { UserRepository } from '../../../database';

/* Interfaces */
import { ChangePasswordRequest } from '../interfaces';

/* Utils */
import { JWT } from '../utils';

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
            const { password } = req.body;
            const { user, token } = req.auth!;

            const match = bcrypt.compareSync(password, user?.password!);
            if (match) return Http.badRequest(res, 'La nueva contraseña debe ser diferente a la anterior.');

            const hash = bcrypt.hashSync(password);
            await UserRepository.findByIdAndUpdate(user._id, { password: hash });

            await JWT.revokeToken(token);
            const newToken = JWT.generateToken({ id: user._id });

            return Http.sendResp(res, {
                msg: 'Haz cambiado tu contraseña correctamente.',
                token: newToken,
                status: 200
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ChangePasswordController;