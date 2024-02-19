/* Test */
import { createRequestMock, createResponseMock } from '@test';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskModel, TaskRepository } from '@database';

/* Tasks */
import { ShowTaskController } from '@tasks';

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

describe('Test in ShowTaskController of tasks module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(ShowTaskController).toHaveProperty('handler');
    });

    it('should return a task', () => {
        const req = createRequestMock({ task: taskMock });

        ShowTaskController.handler(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            task: TaskRepository.endpointAdapter(taskMock), 
            status: Http.OK 
        });
    });

    it('should return internal server error', () => {
        const req = createRequestMock();

        ShowTaskController.handler(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});