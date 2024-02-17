/* Test */
import { createRequestMock, createResponseMock } from '@test';

/* Server */
import { Http } from '@server';

/* Auth */
import { JWT, VerificationsErrorMessages, checkVerificationToken } from '@auth';

const token = JWT.generateToken({ data: 'test' }, '30m');

describe('Test in middleware checkVerificationToken of auth module', () => {
    const { mockClear, next: nextMock, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should call next function', () => {
        const data = JWT.decodeToken(token);
        const tokenExpiration = new Date(data?.exp! * 1000).toISOString();

        const req = createRequestMock({
            query: { token }
        });

        checkVerificationToken(req, res, nextMock);

        expect(req.tokenExpiration).toEqual(tokenExpiration);
        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function because token is not provided', () => {
        const req = createRequestMock();

        checkVerificationToken(req, res, nextMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: VerificationsErrorMessages.UNPROCESSED,
            status: Http.BAD_REQUEST
        });

        expect(req.tokenExpiration).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();
    });

    it('should not call next function because token is invalid', () => {
        const req = createRequestMock({
            query: { token: 'invalid' }
        });

        checkVerificationToken(req, res, nextMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: VerificationsErrorMessages.UNPROCESSED,
            status: Http.BAD_REQUEST
        });

        expect(req.tokenExpiration).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();
    });

    it('should not call next function because token is expired', async () => {
        const tokenExpired = JWT.generateToken({ data: 'test' }, '1s');

        await new Promise(resolve => setTimeout(resolve, 2000));

        const req = createRequestMock({
            query: { token: tokenExpired }
        });

        checkVerificationToken(req, res, nextMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: VerificationsErrorMessages.EXPIRED,
            status: Http.BAD_REQUEST
        });

        expect(req.tokenExpiration).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();
    });
});