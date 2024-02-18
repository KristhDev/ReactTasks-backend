import { Request } from 'express';

/* Server */
import { Http, JsonResponse } from '@server';

/* Database */
import { VerificationRepository } from '@database';

class RemoveVerificationsController {
    public static async handler(req: Request, res: JsonResponse): Promise<JsonResponse> {
        try {
            const currentDate = new Date().toISOString();
            await VerificationRepository.deleteMany({ expiresIn: { $lte: currentDate } });

            return Http.sendResp(res, {
                msg: 'Se eliminaron todas las verificaciones expiradas correctamente.',
                status: Http.OK,
            });
        } 
        catch (error) {
            return Http.internalServerError(res, error as Error);
        }
    }
}

export default RemoveVerificationsController;