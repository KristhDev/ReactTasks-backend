/* Mocks */
import { createRequestMock, createResponseMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { VerificationRepository } from '@database';

/* Modules */
import { RemoveVerificationsController } from '@auth';

const deleteManyVerificationSpy = jest.spyOn(VerificationRepository, 'deleteMany');

describe('Test in RemoveVerificationsController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(RemoveVerificationsController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        deleteManyVerificationSpy.mockResolvedValue(null as any);
        const req = createRequestMock();

        await RemoveVerificationsController.handler(req, res);

        expect(deleteManyVerificationSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyVerificationSpy).toHaveBeenCalledWith({ expiresIn: { $lte: expect.any(String) } });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Se eliminaron todas las verificaciones expiradas correctamente.',
            status: Http.OK
        });
    });

    it('should return internal server error', async () => {
        deleteManyVerificationSpy.mockRejectedValue(new Error('Database error'));
        const req = createRequestMock();

        await RemoveVerificationsController.handler(req, res);

        expect(deleteManyVerificationSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyVerificationSpy).toHaveBeenCalledWith({ expiresIn: { $lte: expect.any(String) } });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
})