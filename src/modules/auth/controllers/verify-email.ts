/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { VerificationRepository, UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, VerifyEmailRequest } from '@auth';

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
            const expiresIn = req.tokenExpiration;

            const verification = await VerificationRepository.findOne({ token, expiresIn });

            if (!verification) {
                await VerificationRepository.deleteOne({ token });
                return Http.badRequest(res, AuthErrorMessages.VERIFICATION_EXPIRED);
            }

            const user = await UserRepository.findById(verification.userId);
            if (user?.verified) return Http.badRequest(res, 'Tu cuenta ya ha sido verificada.');

            await UserRepository.findByIdAndUpdate(verification.userId, { verified: true });
            await VerificationRepository.deleteOne({ id: verification.id });

            return Http.sendResp(res, {
                msg: 'Has verificado tu cuenta correctamente, ya puedes iniciar sesión.',
                status: Http.OK
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default VerifyEmailController;