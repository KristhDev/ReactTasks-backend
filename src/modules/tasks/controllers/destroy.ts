import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Images */
import { ImageService } from '@images';

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
            const task = req.task!;

            if (!!task?.image) await ImageService.destroy(task.image);
            await TaskRepository.deleteOne({ id: task.id });

            return Http.sendResp(res, {
                msg: 'Has eliminado la tarea correctamente.',
                status: Http.OK,
                taskId: task.id
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default DestroyTaskController;