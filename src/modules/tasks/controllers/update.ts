import { UploadedFile } from 'express-fileupload';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Images */
import { ImageService } from '@images';

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
            const { title, deadline, description, status } = req.body;
            const image = req.files?.image as UploadedFile | undefined;
            const task = req.task!;

            let imageUrl = task.image;

            let body = {}

            if (title) body = { ...body, title }
            if (description) body = { ...body, description }
            if (deadline) body = { ...body, deadline }
            if (status) body = { ...body, status }

            if (image && !!imageUrl) await ImageService.destroy(imageUrl);
            if (image) imageUrl = await ImageService.upload(image, process.env.CLOUDINARY_TASKS_FOLDER);

            const updatedTask = await TaskRepository.findByIdAndUpdate(task.id, { ...body, image: imageUrl });

            return Http.sendResp(res, {
                msg: 'Has actualizado la tarea correctamente.',
                status: Http.OK,
                task: TaskRepository.toEndpoint(updatedTask!)
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default UpdateTaskController;