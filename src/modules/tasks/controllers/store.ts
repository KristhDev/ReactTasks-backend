/* Adapters */
import { taskEndpointAdapter } from '../adapters';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { Task } from '../../../database';

/* Interfaces */
import { StoreTaskRequest } from '../interfaces';

class StoreTaskController {
    public static async handler(req: StoreTaskRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const body = req.body;
            const { user } = (req as any).auth;

            const task = await Task.create({ ...body, userId: user._id });

            return Http.sendResp(res, {
                msg: 'Haz agregado la tarea correctamente.',
                status: 201,
                task: taskEndpointAdapter(task)
            });
        }
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default StoreTaskController;