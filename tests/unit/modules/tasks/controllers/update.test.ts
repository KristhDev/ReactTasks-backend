/* Mocks */
import { createRequestMock, createResponseMock, imageMock, imageUrlMock, newImageUrlMock, taskMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Modules */
import { ImageService } from '@images';
import { UpdateTaskController } from '@tasks';

const findByIdAndUpdateTaskSpy = jest.spyOn(TaskRepository, 'findByIdAndUpdate');
const uploadImageSpy = jest.spyOn(ImageService, 'upload');
const destroyImageSpy = jest.spyOn(ImageService, 'destroy');

describe('Test in UpdateTaskController of tasks module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(UpdateTaskController).toHaveProperty('handler');
    });

    it('should return updated task', async () => {
        findByIdAndUpdateTaskSpy.mockResolvedValue(taskMock);

        const bodyMock = {
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
        }

        const req = createRequestMock({ task: taskMock, body: bodyMock });

        await UpdateTaskController.handler(req, res);

        expect(destroyImageSpy).not.toHaveBeenCalled();
        expect(uploadImageSpy).not.toHaveBeenCalled();

        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { ...bodyMock, image: undefined }, { new: true });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Haz actualizado la tarea correctamente.',
            status: Http.OK,
            task: TaskRepository.endpointAdapter(taskMock)
        });
    });

    it('should call destroy and upload methods', async () => {
        taskMock.image = imageUrlMock;

        findByIdAndUpdateTaskSpy.mockResolvedValue({ ...taskMock, image: newImageUrlMock } as any);
        uploadImageSpy.mockResolvedValue(newImageUrlMock);
        destroyImageSpy.mockResolvedValue({} as any);

        const bodyMock = {
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
        }

        const req = createRequestMock({
            task: taskMock,
            body: bodyMock,
            files: { image: imageMock } 
        });

        await UpdateTaskController.handler(req, res);

        expect(destroyImageSpy).toHaveBeenCalledTimes(1);
        expect(destroyImageSpy).toHaveBeenCalledWith(imageUrlMock);

        expect(uploadImageSpy).toHaveBeenCalledTimes(1);
        expect(uploadImageSpy).toHaveBeenCalledWith(imageMock, process.env.CLOUDINARY_TASKS_FOLDER);

        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { ...bodyMock, image: newImageUrlMock }, { new: true });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Haz actualizado la tarea correctamente.',
            status: Http.OK,
            task: TaskRepository.endpointAdapter({ ...taskMock, image: newImageUrlMock } as any) 
        });
    });

    it('should return internal server error', async () => {
        findByIdAndUpdateTaskSpy.mockRejectedValue(new Error('Error'));

        const bodyMock = {
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
        }

        const req = createRequestMock({ task: taskMock, body: bodyMock });

        await UpdateTaskController.handler(req, res);

        expect(destroyImageSpy).not.toHaveBeenCalled();
        expect(uploadImageSpy).not.toHaveBeenCalled();

        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { ...bodyMock, image: imageUrlMock }, { new: true });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});