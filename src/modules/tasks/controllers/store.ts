import { UploadedFile } from 'express-fileupload';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Images */
import { ImageService } from '@images';

/* Interfaces */
import { StoreTaskRequest } from '../interfaces';

class StoreTaskController {
    /**
     * Handles a request to store a task.
     *
     * @param {StoreTaskRequest} req - the request object
     * @param {JsonResponse} res - the response object
     * @return {Promise<JsonResponse>} - the response object with the stored task
     */
    public static async handler(req: StoreTaskRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { title, description, deadline, status } = req.body;
            const image = req.files?.image as UploadedFile | undefined;
            const { user } = req.auth!;

            let imageUrl = '';
            if (image) imageUrl = await ImageService.upload(image, process.env.CLOUDINARY_TASKS_FOLDER);

            const task = await TaskRepository.create({
                userId: user.id,
                title,
                description,
                deadline,
                status,
                image: imageUrl,
            });

            return Http.sendResp(res, {
                msg: 'Has agregado la tarea correctamente.',
                status: Http.CREATED,
                task: TaskRepository.toEndpoint(task)
            });
        }
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default StoreTaskController;