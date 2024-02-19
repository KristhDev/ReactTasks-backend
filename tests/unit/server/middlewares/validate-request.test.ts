/* Mocks */
import { createRequestMock, createResponseMock } from '@mocks';

/* Server */
import { Http, validateRequest } from '@server';

/* Auth */
import { AuthErrorMessages, EmailSchema } from '@auth';

const email = 'tester-unit@gmail.com';

describe('Test in middleware validateRequest of server module', () => {
    const { mockClear, next: nextMock, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should call next function', async () => {
        const req = createRequestMock({ body: { email } });
        await validateRequest(req, res, nextMock, EmailSchema);

        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function because body is invalid', async () => {
        const req = createRequestMock({ body: {} });

        await validateRequest(req, res, nextMock, EmailSchema);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.EMAIL_REQUIRED, 
            status: Http.BAD_REQUEST 
        });

        expect(nextMock).not.toHaveBeenCalled();
    });
});