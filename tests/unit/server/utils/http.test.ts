/* Mocks */
import { createResponseMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Auth */
import { AuthErrorMessages, JWTError } from '@auth';

describe('Test in util http of server module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        mockClear();
    });

    it('should match status codes', () => {
        expect(Http.OK).toBe(200);
        expect(Http.CREATED).toBe(201);
        expect(Http.BAD_REQUEST).toBe(400);
        expect(Http.UNAUTHORIZED).toBe(401);
        expect(Http.NOT_FOUND).toBe(404);
        expect(Http.INTERNAL_SERVER_ERROR).toBe(500);
    });

    it('should call sendResp with correct parameters', () => {
        const data = {
            msg: 'test',
            status: Http.OK
        }

        Http.sendResp(res, data);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(data);
    });

    it('should call badRequest with correct parameters', () => {
        const msg = 'test';
        Http.badRequest(res, msg);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg,
            status: Http.BAD_REQUEST 
        });
    });

    it('should call unauthorized with correct parameters', () => {
        const error = new JWTError('test');
        Http.unauthorized(res, error);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.UNAUTHORIZED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should call notFound with correct parameters', () => {
        const msg = 'test';
        Http.notFound(res, msg);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg,
            status: Http.NOT_FOUND
        });
    });

    it('should use default message in notFound', () => {
        Http.notFound(res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should call internalServerError with correct parameters', () => {
        const error = new Error('test');
        Http.internalServerError(res, error);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});