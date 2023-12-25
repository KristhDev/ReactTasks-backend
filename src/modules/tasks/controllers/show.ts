import { Request } from 'express';

/* Adapters */
import { taskEndpointAdapter } from '../adapters';

/* Server */
import { Http, JsonResponse } from '../../../server';

class ShowTaskController {
    /**
     * Handles the request and returns a JSON response.
     *
     * @param {Request} req - The request object.
     * @param {JsonResponse} res - The response object.
     * @return {JsonResponse} The JSON response.
     */
    public static handler(req: Request, res: JsonResponse): JsonResponse {
        try {
            const task = (req as any).task;

            return Http.sendResp(res, {
                task: taskEndpointAdapter(task),
                status: 200
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ShowTaskController;