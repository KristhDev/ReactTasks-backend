import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

/* Adapters */
import { userEndpointAdapter } from '../adapters';

/* Database */
import { User } from '../../../database';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Schemas */
import { SignInSchema } from '../schemas';

/* Utils */
import { JWT } from '../utils';

class SignInController {
    /**
     * Handles the request to sign in a user.
     *
     * @param {TypedRequestBody<typeof SignInSchema>} req - The request object containing the typed body.
     * @param {Response} res - The response object.
     * @return {Promise<JsonResponse>} A promise that resolves to a JSON response.
     */
    public static async handler(req: Request<any, any, typeof SignInSchema._type>, res: Response): Promise<JsonResponse> {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            const match = bcrypt.compareSync(password, user?.password!);
            if (!match) return Http.badRequest('Las credenciales son incorrectas.', res);

            const token = JWT.generateToken({ id: user?._id });

            return Http.sendResp(res, {
                msg: 'Has ingresado correctamente.', 
                status: 200,
                user: userEndpointAdapter(user!),
                token
            })
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default SignInController;