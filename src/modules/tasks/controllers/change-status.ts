/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Tasks */
import { ChangeStatusTaskRequest } from '@tasks';

class ChangeStatusTaskController {
    /**
     * Handles the request to change the status of a task.
     *
     * @param {ChangeStatusTaskRequest} req - The request object containing the new status.
     * @param {JsonResponse} res - The response object to send the updated task in.
     * @return {Promise<JsonResponse>} The response object containing the updated task.
     */
    public static async handler(req: ChangeStatusTaskRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { status } = req.body;
            const task = req.task!;

            const updatedTask = await TaskRepository.findByIdAndUpdate(task.id, { status });

            return Http.sendResp(res, {
                status: Http.OK,
                task: TaskRepository.toEndpoint(updatedTask!)
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ChangeStatusTaskController;