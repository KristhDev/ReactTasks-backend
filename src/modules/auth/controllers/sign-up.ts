import bcrypt from 'bcryptjs';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { EmailVerificationRepository, UserRepository } from '../../../database';

/* Services */
import { EmailService } from '../services';

/* Interfaces */
import { SignUpRequest } from '../interfaces';
import { JWT } from '../utils';

class SignUpController {
    /**
     * Handles the request for signing up a user.
     *
     * @param {SignUpRequest} req - The request object containing the user's information.
     * @param {Response} res - The response object to send the result.
     * @returns {Promise<JsonResponse>} The JSON response containing the result of the sign up operation.
     */
    public static async handler(req: SignUpRequest, res: JsonResponse): Promise<JsonResponse> {
        const body = req.body;

        try {
            const user = await UserRepository.create({
                name: body.name,
                email: body.email,
                password: bcrypt.hashSync(body.password)
            });

            const token = JWT.generateToken({ nothing: 'Nothing' }, '30m');
            const data = JWT.decodeToken(token);
            const expiresIn = new Date(data?.exp! * 1000).toISOString();

            await EmailVerificationRepository.create({ userId: user?._id, token: token, expiresIn });

            await EmailService.sendEmailVerification({
                email: body.email,
                name: body.name,
                token
            });

            return Http.sendResp(res, {
                msg: `Te has registrado correctamente. Hemos enviado un correo de verificación a ${ body.email }, por favor confirma tu cuenta.`, 
                status: 201
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SignUpController;