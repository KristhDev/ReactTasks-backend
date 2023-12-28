import { UploadedFile } from 'express-fileupload';

/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { TaskRepository } from '../../../database';

/* Services */
import { ImageService } from '../../images';

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
            const body = req.body;
            const image = req.files?.image as UploadedFile | undefined;
            const { user } = req.auth!;

            let imageUrl = '';
            if (image) imageUrl = await ImageService.upload(image);

            const task = await TaskRepository.create({ ...body, image: imageUrl, userId: user._id });

            return Http.sendResp(res, {
                msg: 'Haz agregado la tarea correctamente.',
                status: 201,
                task: TaskRepository.endpointAdapter(task)
            });
        }
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default StoreTaskController;