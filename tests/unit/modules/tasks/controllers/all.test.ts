/* Mocks */
import { createRequestMock, createResponseMock, taskMock, userMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Tasks */
import { IndexTaskController } from '@tasks';

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

        const queryDB = {
            userId: userMock._id,
            $or: [ 
                { title: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } } 
            ] 
        }

        expect(paginateTaskSpy).toHaveBeenCalledTimes(1);
        expect(paginateTaskSpy).toHaveBeenCalledWith({
            limit: 12,
            page,
            query: queryDB,
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