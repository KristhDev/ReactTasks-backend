/* Mocks */
import { createRequestMock, createResponseMock, taskMock, taskModelMock, userMock } from '@mocks';

/* Server */
import { Http } from '@server';

/* Database */
import { TaskSchema } from '@database';

/* Modules */
import { AuthErrorMessages } from '@auth';
import { TaskErrorMessages, taskExists } from '@tasks';

const findOneTaskSpy = jest.spyOn(TaskSchema, 'findOne');

describe('Test in taskExists middleware of tasks module', () => {
    const { mockClear, res, next: nextMock } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    }); 

    it('should call next function', async () => {
        const req = createRequestMock({
            auth: { user: userMock }, 
            params: { taskId: taskMock.id } 
        });

        findOneTaskSpy.mockResolvedValue(taskModelMock);

        await taskExists(req, res, nextMock);

        expect(req.task).toEqual({
            ...taskMock,
            image: taskMock.image,
            deadline: expect.any(String),
            createdAt: new Date(taskMock.createdAt).toISOString(),
            updatedAt: new Date(taskMock.updatedAt).toISOString()
        });

        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function because auth is not defined', async () => {
        const req = createRequestMock({
            params: { taskId: taskMock.id }
        });

        await taskExists(req, res, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(findOneTaskSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(Http.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should not call next function because task is not found', async () => {
        const req = createRequestMock({
            auth: { user: userMock }, 
            params: { taskId: taskMock.id } 
        });

        findOneTaskSpy.mockResolvedValue(null);

        await taskExists(req, res, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(findOneTaskSpy).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
            msg: TaskErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should not call next function because task id is invalid', async () => {
        const req = createRequestMock({
            auth: { user: userMock },
            params: { taskId: 'invalid' }
        });

        await taskExists(req, res, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(findOneTaskSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
            msg: TaskErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });
});