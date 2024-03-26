/* Mocks */
import { createRequestMock, createResponseMock, taskMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Tasks */
import { ShowTaskController } from '@tasks';

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
            task: TaskRepository.toEndpoint(taskMock), 
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