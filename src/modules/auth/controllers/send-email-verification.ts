/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { VerificationRepository } from '@database';

/* Auth */
import { EmailService, SendEmailVerificationRequest, JWT } from '@auth';

class SendEmailVerificationController {
    /**
     * Sends an email verification request.
     *
     * @param {SendEmailVerificationRequest} req - the request object containing the necessary data to send the verification email
     * @param {JsonResponse} res - the response object to send the JSON response
     * @return {Promise<JsonResponse>} - a promise that resolves to the JSON response
     */
    public static async handler(req: SendEmailVerificationRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const user = req.user!;
            if (user.verified) return Http.badRequest(res, 'Tu cuenta ya ha sido verificada.');

            const token = JWT.generateToken({ nothing: 'Nothing' }, '30m');
            const data = JWT.decodeToken(token);
            const expiresIn = new Date(data?.exp! * 1000).toISOString();

            await VerificationRepository.create({ userId: user?._id, token, type: 'email', expiresIn });

            await EmailService.sendEmailVerification({
                email: user.email,
                name: user.name,
                token
            });

            return Http.sendResp(res, {
                msg: 'Hemos enviado un correo de verificación, por favor confirma tu cuenta.', 
                status: Http.OK
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SendEmailVerificationController;