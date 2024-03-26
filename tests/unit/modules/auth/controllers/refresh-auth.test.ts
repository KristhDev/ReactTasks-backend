/* Mocks */
import { createRequestMock, createResponseMock, userMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { JWT, RefreshAuthController } from '@auth';

const revokeToken = jest.spyOn(JWT, 'revokeToken');

describe('Test in RefreshAuthController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(RefreshAuthController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        revokeToken.mockImplementation(() => Promise.resolve());
        const oldToken = JWT.generateToken({ id: userMock.id });

        const req = createRequestMock({
            auth: {
                token: oldToken,
                user: userMock
            }
        });

        await RefreshAuthController.handler(req, res);

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(revokeToken).toHaveBeenCalledWith(oldToken);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            status: Http.OK,
            user: UserRepository.toEndpoint(userMock),
            token: expect.any(String)
        });
    });

    it('should return an internal server error', async () => {
        revokeToken.mockRejectedValue(new Error('Database error'));
        const oldToken = JWT.generateToken({ id: userMock.id });

        const req = createRequestMock({
            auth: {
                token: oldToken,
                user: userMock
            }
        });

        await RefreshAuthController.handler(req, res);

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(revokeToken).toHaveBeenCalledWith(oldToken);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});