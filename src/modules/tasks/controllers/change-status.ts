/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { TaskRepository } from '../../../database';

/* Interfaces */
import { ChangeStatusTaskRequest } from '../interfaces';

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

            const updatedTask = await TaskRepository.findByIdAndUpdate(task._id, { status }, { new: true });

            return Http.sendResp(res, {
                status: 200,
                task: TaskRepository.endpointAdapter(updatedTask!)
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default ChangeStatusTaskController;