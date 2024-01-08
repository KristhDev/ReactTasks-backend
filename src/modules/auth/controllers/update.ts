/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { UserRepository } from '../../../database';

/* Interfaces */
import { UpdateUserRequest } from '../interfaces';

class UpdateUserController {
    /**
     * Handle the UpdateUserRequest and send a JsonResponse.
     *
     * @param {UpdateUserRequest} req - the UpdateUserRequest object containing the request data
     * @param {JsonResponse} res - the JsonResponse object to send the response
     * @return {Promise<JsonResponse>} - a promise that resolves with the JsonResponse object
     */
    public static async handler(req: UpdateUserRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { user } = req.auth!;
            const { name, lastname } = req.body;

            const userUpdated = await UserRepository.findByIdAndUpdate(user._id, { name, lastname }, { new: true });

            return Http.sendResp(res, {
                msg: 'Has actualizado tus datos correctamente.',
                status: Http.OK,
                user: UserRepository.endpointAdapter(userUpdated!),
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default UpdateUserController;