/* Mocks */
import { createRequestMock, createResponseMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { TokenRepository } from '@database';

/* Modules */
import { RemoveTokensController } from '@auth';

const deleteManyTokenSpy = jest.spyOn(TokenRepository, 'deleteMany');

describe('Test in RemoveTokensController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(RemoveTokensController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        deleteManyTokenSpy.mockResolvedValue(null as any);
        const req = createRequestMock();

        await RemoveTokensController.handler(req, res);

        expect(deleteManyTokenSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyTokenSpy).toHaveBeenCalledWith({ expiresIn: { $lte: expect.any(String) } });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Se eliminaron todos los tokens expirados correctamente.',
            status: Http.OK
        });
    });

    it('should return internal server error', async () => {
        deleteManyTokenSpy.mockRejectedValue(new Error('Database error'));
        const req = createRequestMock();

        await RemoveTokensController.handler(req, res);

        expect(deleteManyTokenSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyTokenSpy).toHaveBeenCalledWith({ expiresIn: { $lte: expect.any(String) } });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
})