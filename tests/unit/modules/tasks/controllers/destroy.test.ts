/* Mocks */
import { createRequestMock, createResponseMock, imageUrlMock, taskMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Modules */
import { DestroyTaskController } from '@tasks';
import { ImageService } from '@images';

const deleteOneTaskSpy = jest.spyOn(TaskRepository, 'deleteOne');
const imageDestroySpy = jest.spyOn(ImageService, 'destroy');

describe('Test in DestroyTaskController of tasks module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(DestroyTaskController).toHaveProperty('handler');
    });

    it('should delete a task', async () => {
        deleteOneTaskSpy.mockResolvedValue(null as any);

        const req = createRequestMock({ task: taskMock });

        await DestroyTaskController.handler(req, res);

        expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has eliminado la tarea correctamente.',
            status: Http.OK,
            taskId: taskMock._id
        });
    });

    it('should delete task with image', async () => {
        deleteOneTaskSpy.mockResolvedValue(null as any);
        imageDestroySpy.mockResolvedValue(null as any);

        const req = createRequestMock({ task: { ...taskMock, image: imageUrlMock } });

        await DestroyTaskController.handler(req, res);

        expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id });

        expect(imageDestroySpy).toHaveBeenCalledTimes(1);
        expect(imageDestroySpy).toHaveBeenCalledWith(imageUrlMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has eliminado la tarea correctamente.',
            status: Http.OK,
            taskId: taskMock._id
        });
    });

    it('should return internal server error', async () => {
        deleteOneTaskSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({ task: taskMock });

        await DestroyTaskController.handler(req, res);

        expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});