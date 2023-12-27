import { JwtPayload } from 'jsonwebtoken';

import { Http, JsonResponse } from '../../../server';

import { VerifyEmailRequest } from '../interfaces';

import { JWT } from '../utils';
import { EmailVerificationRepository, UserRepository } from '../../../database';

class VerifyEmailController {
    /**
     * Handles the verification of an email.
     *
     * @param {VerifyEmailRequest} req - The request object containing the verification token.
     * @param {JsonResponse} res - The response object to send the result of the verification.
     * @return {Promise<JsonResponse>} The response object containing the result of the verification.
     */
    public static async handler(req: VerifyEmailRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { token } = req.query;
            const expiresIn = (req as any).tokenExpiration;

            const emailVerification = await EmailVerificationRepository.findOne({ token, expiresIn });

            if (!emailVerification) {
                await EmailVerificationRepository.deleteOne({ token });
                return Http.badRequest(res, 'El enlace de verificación ha expirado, por favor solicita otra verificación de cuenta.');
            }

            await UserRepository.findByIdAndUpdate(emailVerification.userId, { verified: true });
            await EmailVerificationRepository.deleteOne({ _id: emailVerification._id });

            return Http.sendResp(res, {
                msg: 'Haz verificado tu cuenta correctamente, ya puedes iniciar sesión.',
                status: 200
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default VerifyEmailController;