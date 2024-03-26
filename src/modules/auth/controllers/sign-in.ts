/* Database */
import { UserRepository } from '@database';

/* Server */
import { Http, JsonResponse } from '@server';

/* Auth */
import { AuthErrorMessages, Encrypt, JWT, SignInRequest } from '@auth';

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
            if (!user?.verified) return Http.badRequest(res, AuthErrorMessages.UNVERIFIED);

            const match = Encrypt.compareHash(password, user?.password!);
            if (!match) return Http.badRequest(res, AuthErrorMessages.INVALID_CREDENTIALS);

            const token = JWT.generateToken({ id: user.id });

            return Http.sendResp(res, {
                msg: 'Has ingresado correctamente.', 
                status: Http.OK,
                user: UserRepository.toEndpoint(user!),
                token
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SignInController;