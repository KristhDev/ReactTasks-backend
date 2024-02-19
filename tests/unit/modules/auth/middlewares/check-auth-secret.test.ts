/* Mocks */
import { createRequestMock, createResponseMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Auth */
import { checkAuthSecret } from '@auth';

const nextMock = jest.fn();

describe('Test in middleware checkAuthSecret of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    }); 

    it('should call next function', async () => {
        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ process.env.AUTH_SECRET! }`
            }
        });

        await checkAuthSecret(req, res, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function because token is not provided', async () => {
        const req = createRequestMock();

        await checkAuthSecret(req, res, nextMock);

        expect(nextMock).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should not call next function because token is invalid', async () => {
        const req = createRequestMock({
            headers: {
                authorization: 'Bearer invalid'
            }
        });

        await checkAuthSecret(req, res, nextMock);

        expect(nextMock).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });
});