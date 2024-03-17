/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { TaskRepository } from '@database';

/* Tasks */
import { IndexTaskRequest } from '@tasks';

class IndexTaskController {
    /**
     * Handles the request for the index task.
     *
     * @param {IndexTaskRequest} req - The request object.
     * @param {JsonResponse} res - The response object.
     * @return {Promise<JsonResponse>} The response object containing the tasks and pagination.
     */
    public static async handler(req: IndexTaskRequest, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { user } = req.auth!;
            const query = req.query.query || '';
            let page = Number(req.query.page || 1);

            let queryDB = { userId: user._id };

            if (isNaN(page) || page < 1) page = 1;
            if (query.trim().length > 0) queryDB = Object.assign(queryDB, { $text: { $search: `/${ query }/` } });

            const result = await TaskRepository.paginate({ limit: 12, page, query: queryDB, sort: { createdAt: -1 } });

            return Http.sendResp(res, {
                status: Http.OK,
                tasks: result?.docs?.map((task) => TaskRepository.endpointAdapter(task as any)) || [],
                pagination: {
                    currentPage: result?.page || 0,
                    hasNextPage: result?.hasNextPage || false,
                    hasPrevPage: result?.hasPrevPage || false,
                    nextPage: result?.nextPage || 0,
                    query,
                    totalPages: result?.totalPages || 0
                }
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default IndexTaskController;