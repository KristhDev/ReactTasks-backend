/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { VerificationRepository, UserRepository } from '@database';

/* Services */
import { EmailService, SignUpRequest, JWT, Encrypt } from '@auth';

class SignUpController {
    /**
     * Handles the request for signing up a user.
     *
     * @param {SignUpRequest} req - The request object containing the user's information.
     * @param {Response} res - The response object to send the result.
     * @returns {Promise<JsonResponse>} The JSON response containing the result of the sign up operation.
     */
    public static async handler(req: SignUpRequest, res: JsonResponse): Promise<JsonResponse> {
        const { name, lastname, email, password } = req.body;

        try {
            const user = await UserRepository.create({
                name,
                lastname,
                email,
                password: Encrypt.createHash(password)
            });

            const token = JWT.generateToken({ nothing: 'Nothing' }, '30m');
            const data = JWT.decodeToken(token);
            const expiresIn = new Date(data?.exp! * 1000).toISOString();

            await VerificationRepository.create({ userId: user.id, token, type: 'email', expiresIn });
            await EmailService.sendEmailVerification({ email, name, token });

            return Http.sendResp(res, {
                msg: 'Te has registrado correctamente. Hemos enviado un correo de verificación al correo que nos proporcionaste, por favor confirma tu cuenta.', 
                status: Http.CREATED
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SignUpController;