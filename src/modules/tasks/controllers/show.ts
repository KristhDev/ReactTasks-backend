import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TaskRepository } from '@database';

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
            const task = req.task!;

            return Http.sendResp(res, {
                task: TaskRepository.endpointAdapter(task),
                status: Http.OK
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ShowTaskController;