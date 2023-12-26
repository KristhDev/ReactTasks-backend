/* Server */
import { Http, JsonResponse } from '../../../server';

/* Database */
import { TaskRepository } from '../../../database';

/* Interfaces */
import { IndexTaskRequest } from '../interfaces';

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
            const { user } = (req as any).auth;
            const query = req.query.query || '';
            const page = req.query.page || 1;

            let queryDB = { userId: user._id };

            if (query.trim().length > 0) {
                queryDB = Object.assign(queryDB, { $text: { $search: `/${ query }/` } });
            }

            const result = await TaskRepository.paginate({ limit: 20, page, query: queryDB, sort: { createdAt: -1 } });

            return Http.sendResp(res, {
                status: 200,
                tasks: result?.docs?.map((task) => TaskRepository.endpointAdapter(task as any)) || [],
                pagination: {
                    hasNextPage: result?.hasNextPage || false,
                    nextPage: result?.nextPage || 0,
                    currentPage: result?.page || 0,
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