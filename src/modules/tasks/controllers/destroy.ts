import { Request } from 'express';

/* Database */
import { TaskModel, TaskRepository } from '../../../database';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Services */
import { ImageService } from '../../images';

class DestroyTaskController {

    /**
     * Deletes a task from the database.
     *
     * @param {Request} req - The request object.
     * @param {JsonResponse} res - The response object.
     * @return {Promise<JsonResponse>} The updated response object.
     */
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const task = (req as any).task as TaskModel;

            if (!!task?.image) await ImageService.delete(task.image);
            await TaskRepository.deleteOne({ _id: task._id });

            return Http.sendResp(res, {
                msg: 'Haz eliminado la tarea correctamente.',
                status: 200,
                taskId: task._id
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default DestroyTaskController;