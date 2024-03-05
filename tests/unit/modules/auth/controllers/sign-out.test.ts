/* Mocks */
import { createRequestMock, createResponseMock, userMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Auth */
import { JWT, SignOutController } from '@auth';

const revokeToken = jest.spyOn(JWT, 'revokeToken');

describe('Test in SignOutController of auth module', () => {
    const token = JWT.generateToken({ id: userMock._id });
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(SignOutController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        revokeToken.mockImplementation(() => Promise.resolve());

        const req = createRequestMock({
            auth: {
                token
            }
        });

        await SignOutController.handler(req, res);

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(revokeToken).toHaveBeenCalledWith(token);1

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has cerrado sesión correctamente.',
            status: Http.OK
        });
    });

    it('should return an internal server error', async () => {
        revokeToken.mockImplementation(() => Promise.reject(new Error('Database error')));

        const req = createRequestMock({
            auth: {
                token
            }
        });

        await SignOutController.handler(req, res);

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(revokeToken).toHaveBeenCalledWith(token);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});