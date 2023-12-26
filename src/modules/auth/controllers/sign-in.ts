import bcrypt from 'bcryptjs';

/* Database */
import { UserRepository } from '../../../database';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Interfaces */
import { SignInRequest } from '../interfaces';

/* Utils */
import { JWT } from '../utils';

class SignInController {
    /**
     * Handles the request to sign in a user.
     *
     * @param {SignInRequest} req - The request object containing the typed body.
     * @param {Response} res - The response object.
     * @return {Promise<JsonResponse>} A promise that resolves to a JSON response.
     */
    public static async handler(req: SignInRequest, res: JsonResponse): Promise<JsonResponse> {
        const { email, password } = req.body;

        try {
            const user = await UserRepository.findOne({ email });

            const match = bcrypt.compareSync(password, user?.password!);
            if (!match) return Http.badRequest(res, 'Las credenciales son incorrectas.');

            const token = JWT.generateToken({ id: user?._id });

            return Http.sendResp(res, {
                msg: 'Has ingresado correctamente.', 
                status: 200,
                user: UserRepository.endpointAdapter(user!),
                token
            })
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SignInController;