import { Request } from 'express';

/* Adapters */
import { taskEndpointAdapter } from '../adapters';

/* Database */
import { Task } from '../../../database';

/* Interfaces */
import { Http, JsonResponse } from '../../../server';

class IndexController {
    public static async handler(req: Request<any, any, any, { query?: string, page?: number }>, res: JsonResponse): Promise<JsonResponse> {
        try {
            const { user } = (req as any).auth;
            const query = req.query.query || '';
            const page = req.query.page || 1;

            let queryDB = { userId: user._id };

            if (query.trim().length > 0) {
                queryDB = Object.assign(queryDB, { $text: { $search: `/${ query }/` } });
            }

            const result = await Task.paginate({ limit: 20, page, query: queryDB, sort: { createdAt: -1 } });

            return Http.sendResp(res, {
                status: 200,
                tasks: result?.docs?.map((task) => taskEndpointAdapter(task as any)) || [],
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

export default IndexController;