import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { VerificationRepository } from '@database';

/* Auth */
import { AuthErrorMessages, EmailService, JWT } from '@auth';

class ForgotPasswordController {
    /**
     * Handles the request and generates a response.
     *
     * @param {Request} req - the request object
     * @param {JsonResponse} res - the response object
     * @return {Promise<JsonResponse>} - a promise that resolves to the response object
     */
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const user = req.user!;
            if (!user.verified) return Http.badRequest(res, AuthErrorMessages.UNVERIFIED);

            const token = JWT.generateToken({ id: user._id }, '30m');
            const data = JWT.decodeToken(token);
            const expiresIn = new Date(data?.exp! * 1000).toISOString();

            await VerificationRepository.create({ userId: user?._id, token, type: 'password', expiresIn });

            await EmailService.sendEmailResetPassword({
                email: user.email,
                name: user.name,
                token
            });

            return Http.sendResp(res, {
                msg: 'Hemos enviado un correo para restablecer tu contraseña, por favor revisalo.', 
                status: Http.OK
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ForgotPasswordController;