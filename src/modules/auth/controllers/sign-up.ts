import { Response } from 'express';
import { TypedRequestBody } from 'zod-express-middleware';
import bcrypt from 'bcryptjs';

/* Adapters */
import { userEndpointAdapter } from '../adapters';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { User } from '../../../database';

/* Schemas */
import { SignUpSchema } from '../schemas';

/* Utils */
import { JWT } from '../utils';

class SignUpController {
    /**
     * Handles the request for signing up a user.
     *
     * @param {TypedRequestBody<typeof SignUpSchema>} req - The request object containing the user's information.
     * @param {Response} res - The response object to send the result.
     * @returns {Promise<JsonResponse>} The JSON response containing the result of the sign up operation.
     */
    public static async handler(req: TypedRequestBody<typeof SignUpSchema>, res: Response): Promise<JsonResponse> {
        const body = req.body;

        try {
            const user = await User.create({
                name: body.name,
                email: body.email,
                password: bcrypt.hashSync(body.password)
            });

            const token = JWT.generateToken({ id: user._id });

            return Http.sendResp(res, {
                msg: 'Te has registrado correctamente.', 
                status: 201,
                user: userEndpointAdapter(user),
                token
            });
        } 
        catch (error) {
            return Http.internalServerError(res);
        }
    }
}

export default SignUpController;