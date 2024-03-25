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

            let queryDB = { userId: user.id };

            if (isNaN(page) || page < 1) page = 1;

            if (query.trim().length > 0) {
                queryDB = Object.assign(queryDB, { 
                    $or: [ 
                        { title: { $regex: query, $options: 'i' } }, 
                        { description: { $regex: query, $options: 'i' } } 
                    ] 
                });
            }

            const result = await TaskRepository.paginate({ limit: 12, page, query: queryDB, sort: { createdAt: -1 } });

            return Http.sendResp(res, {
                status: Http.OK,
                tasks: result.tasks.map((task) => TaskRepository.toEndpoint(task)),
                pagination: {
                    ...result.pagination,
                    query
                }
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default IndexTaskController;