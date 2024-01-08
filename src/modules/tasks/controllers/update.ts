import { UploadedFile } from 'express-fileupload';

/* Database */
import { TaskRepository } from '../../../database';

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
            const task = req.task!;

            let imageUrl = task.image;

            if (image && !!imageUrl) await ImageService.delete(imageUrl);
            if (image) imageUrl = await ImageService.upload(image);

            const updatedTask = await TaskRepository.findByIdAndUpdate(task._id, { ...body, image: imageUrl }, { new: true });

            return Http.sendResp(res, {
                msg: 'Haz actualizado la tarea correctamente.',
                status: Http.OK,
                task: TaskRepository.endpointAdapter(updatedTask!)
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default UpdateTaskController;