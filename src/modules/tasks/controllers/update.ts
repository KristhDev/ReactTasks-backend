import { UploadedFile } from 'express-fileupload';

/* Adapters */
import { taskEndpointAdapter } from '../adapters';

/* Database */
import { Task, TaskModel } from '../../../database';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Services */
import { ImageService } from '../../images';

/* Interfaces */
import { UpdateTaskRequest } from '../interfaces';

class UpdateTaskController {
    /**
     * Handles the update task request.
     *
     * @param {UpdateTaskRequest} req - The update task request.
     * @param {JsonResponse} res - The JSON response object.
     * @return {Promise<JsonResponse>} A promise that resolves to the JSON response.
     */
    public static async handler(req: UpdateTaskRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const body = req.body;
            const image = req.files?.image as UploadedFile | undefined;
            const task = (req as any).task as TaskModel;

            let imageUrl = task.image;

            if (image && !!imageUrl) await ImageService.delete(imageUrl);
            if (image) imageUrl = await ImageService.upload(image);

            const updatedTask = await Task.findByIdAndUpdate(task._id, { ...body, image: imageUrl }, { new: true });

            return Http.sendResp(res, {
                msg: 'Haz actualizado la tarea correctamente.',
                status: 200,
                task: taskEndpointAdapter(updatedTask!)
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default UpdateTaskController;