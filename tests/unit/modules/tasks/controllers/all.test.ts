/* Test */
import { createRequestMock, createResponseMock } from '@test';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskModel, TaskRepository, UserModel } from '@database';

/* Tasks */
import { IndexTaskController } from '@tasks';

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

const paginateTaskSpy = jest.spyOn(TaskRepository, 'paginate');

const paginationMock = {
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 1,
    query: '',
    totalPages: 2
}

describe('Test in IndexTaskController of tasks module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(IndexTaskController).toHaveProperty('handler');
    });

    it('should return tasks and pagination', async () => {
        paginateTaskSpy.mockResolvedValue({
            docs: [ taskMock ],
            page: paginationMock.currentPage,
            hasNextPage: paginationMock.hasNextPage,
            hasPrevPage: paginationMock.hasPrevPage,
            nextPage: paginationMock.nextPage,
            totalPages: paginationMock.totalPages,
        } as any);

        const req = createRequestMock({
            auth: { user: userMock },
        });

        await IndexTaskController.handler(req, res);

        expect(paginateTaskSpy).toHaveBeenCalledTimes(1);
        expect(paginateTaskSpy).toHaveBeenCalledWith({
            limit: 12,
            page: 1,
            query: { userId: userMock._id },
            sort: { createdAt: -1 }
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            status: Http.OK,
            tasks: [ TaskRepository.endpointAdapter(taskMock) ],
            pagination: paginationMock
        });
    });

    it('should use query and page of search params', async () => {
        const query = 'test-query';
        const page = 2;

        paginateTaskSpy.mockResolvedValue({
            docs: [ taskMock ],
            page,
            hasNextPage: paginationMock.hasNextPage,
            hasPrevPage: paginationMock.hasPrevPage,
            nextPage: page,
            totalPages: page,
        } as any);

        const req = createRequestMock({
            auth: { user: userMock },
            query: { query, page: page.toString() }
        });

        await IndexTaskController.handler(req, res);

        expect(paginateTaskSpy).toHaveBeenCalledTimes(1);
        expect(paginateTaskSpy).toHaveBeenCalledWith({
            limit: 12,
            page,
            query: { userId: userMock._id, $text: { $search: `/${ query }/` } },
            sort: { createdAt: -1 }
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            status: Http.OK,
            tasks: [ TaskRepository.endpointAdapter(taskMock) ],
            pagination: {
                ...paginationMock,
                query,
                currentPage: page,
                nextPage: page,
                totalPages: page
            }
        });
    });

    it('should return internal server error', async () => {
        paginateTaskSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({
            auth: { user: userMock },
        });

        await IndexTaskController.handler(req, res);

        expect(paginateTaskSpy).toHaveBeenCalledTimes(1);
        expect(paginateTaskSpy).toHaveBeenCalledWith({
            limit: 12,
            page: 1,
            query: { userId: userMock._id },
            sort: { createdAt: -1 }
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