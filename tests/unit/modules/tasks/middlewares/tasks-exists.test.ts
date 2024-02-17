import { createRequestMock, createResponseMock } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Task, TaskModel, UserModel } from '@database';

/* Modules */
import { AuthErrorMessages } from '@auth';
import { TaskErrorMessages, taskExists } from '@tasks';

const taskMock: TaskModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    userId: '65cad8ccb2092e00addead85',
    title: 'Task title',
    description: 'Task description',
    deadline: new Date().toISOString(),
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as TaskModel;

const userMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: 'tutuyoyo9102',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

const findOneTaskSpy = jest.spyOn(Task, 'findOne');

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

        findOneTaskSpy.mockResolvedValue(taskMock);

        await taskExists(req, res, nextMock);

        expect(req.task).toEqual(taskMock);
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