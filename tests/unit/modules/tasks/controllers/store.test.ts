/* Mocks */
import { createRequestMock, createResponseMock, imageMock, imageUrlMock, taskMock, userMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Modules */
import { StoreTaskController } from '@tasks';
import { ImageService } from '@images';

const createTaskSpy = jest.spyOn(TaskRepository, 'create');
const uploadImageSpy = jest.spyOn(ImageService, 'upload');

describe('Test in StoreTaskController of tasks module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(StoreTaskController).toHaveProperty('handler');
    });

    it('should return a new task', async () => {
        createTaskSpy.mockResolvedValue(taskMock);
        uploadImageSpy.mockResolvedValue(imageUrlMock);

        const req = createRequestMock({
            auth: {
                user: userMock
            },
            body: {
                title: taskMock.title,
                description: taskMock.description,
                deadline: taskMock.deadline
            }
        });

        await StoreTaskController.handler(req, res);

        expect(uploadImageSpy).not.toHaveBeenCalled();

        expect(createTaskSpy).toHaveBeenCalledTimes(1);
        expect(createTaskSpy).toHaveBeenCalledWith({
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
            userId: userMock._id,
            image: ''
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.CREATED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has agregado la tarea correctamente.',
            status: Http.CREATED,
            task: TaskRepository.endpointAdapter(taskMock)
        });
    });

    it('should call upload of ImageService if image is provided', async () => {
        taskMock.image = imageUrlMock;
        createTaskSpy.mockResolvedValue(taskMock);
        uploadImageSpy.mockResolvedValue(imageUrlMock);

        const req = createRequestMock({
            auth: {
                user: userMock
            },
            body: {
                title: taskMock.title,
                description: taskMock.description,
                deadline: taskMock.deadline
            },
            files: {
                image: imageMock
            }
        });

        await StoreTaskController.handler(req, res);

        expect(uploadImageSpy).toHaveBeenCalledTimes(1);
        expect(uploadImageSpy).toHaveBeenCalledWith(imageMock, process.env.CLOUDINARY_TASKS_FOLDER);

        expect(createTaskSpy).toHaveBeenCalledTimes(1);
        expect(createTaskSpy).toHaveBeenCalledWith({
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
            userId: userMock._id,
            image: imageUrlMock
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.CREATED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has agregado la tarea correctamente.',
            status: Http.CREATED,
            task: TaskRepository.endpointAdapter(taskMock)
        });
    });

    it('should return internal server error', async () => {
        createTaskSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({
            auth: {
                user: userMock
            },
            body: {
                title: taskMock.title,
                description: taskMock.description,
                deadline: taskMock.deadline
            }
        });

        await StoreTaskController.handler(req, res);

        expect(createTaskSpy).toHaveBeenCalledTimes(1);
        expect(createTaskSpy).toHaveBeenCalledWith({
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
            userId: userMock._id,
            image: ''
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});