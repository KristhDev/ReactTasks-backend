/* Test */
import { createRequestMock, createResponseMock } from '@test';

/* Mocks */
import { taskMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Tasks */
import { ChangeStatusTaskController } from '@tasks';

const findByIdAndUpdateTaskSpy = jest.spyOn(TaskRepository, 'findByIdAndUpdate');
const newStatus = 'completed';

const updatedTaskMock = {
    ...taskMock,
    status: newStatus
}

describe('Test in ChangeStatusTaskController of tasks module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(ChangeStatusTaskController).toHaveProperty('handler');
    });

    it('should return a updated task', async () => {
        findByIdAndUpdateTaskSpy.mockResolvedValue(updatedTaskMock as any);

        const req = createRequestMock({
            body: { status: newStatus },
            task: taskMock
        });

        await ChangeStatusTaskController.handler(req, res);

        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { status: newStatus }, { new: true });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            status: Http.OK,
            task: TaskRepository.endpointAdapter(updatedTaskMock as any)
        });
    });

    it('should return internal server error', async () => {
        findByIdAndUpdateTaskSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({
            body: { status: newStatus },
            task: taskMock
        });

        await ChangeStatusTaskController.handler(req, res);

        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { status: newStatus }, { new: true });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});