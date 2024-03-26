/* Mocks */
import { createRequestMock, createResponseMock, userVerifiedMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, JWT, JWTError, JWTErrorMessages, checkAuth } from '@auth';

const findByIdUserSpy = jest.spyOn(UserRepository, 'findById');
const validateTokenSpy = jest.spyOn(JWT, 'validateToken');

const token = JWT.generateToken({ id: '65cad8ccb2092e00addead85' });
const tokenData = JWT.decodeToken<{ id: string }>(token);

describe('Test in middleware checkAuth of auth module', () => {
    const { mockClear, next: nextMock, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should call next function', async () => {
        validateTokenSpy.mockResolvedValue(tokenData as any);
        findByIdUserSpy.mockResolvedValue(userVerifiedMock);

        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ token }`
            }
        });

        await checkAuth(req, res, nextMock);

        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledWith(userVerifiedMock.id);

        expect(req.auth).toEqual({ user: userVerifiedMock, token });
        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function because token is not provided', async () => {
        const req = createRequestMock();

        await checkAuth(req, res, nextMock);

        expect(findByIdUserSpy).not.toHaveBeenCalled();
        expect(validateTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.UNAUTHORIZED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });

        expect(req.auth).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();
    });

    it('should not call next function because user not found', async () => {
        validateTokenSpy.mockResolvedValue(tokenData as any);
        findByIdUserSpy.mockResolvedValue(null);

        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ token }`
            }
        });

        await checkAuth(req, res, nextMock);

        expect(validateTokenSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });

        expect(req.auth).toBeUndefined();
    });

    it('should not call next function because user is unverified', async () => {
        validateTokenSpy.mockResolvedValue(tokenData as any);
        findByIdUserSpy.mockResolvedValue({ ...userVerifiedMock, verified: false });

        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ token }`
            }
        });

        await checkAuth(req, res, nextMock);

        expect(validateTokenSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNVERIFIED,
            status: Http.BAD_REQUEST
        });

        expect(req.auth).toBeUndefined();
    });

    it('should not call next function because token is expired', async () => {
        validateTokenSpy.mockRejectedValue(new JWTError(JWTErrorMessages.EXPIRED));

        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ token }`
            }
        });

        await checkAuth(req, res, nextMock);

        expect(validateTokenSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.UNAUTHORIZED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });

        expect(req.auth).toBeUndefined();
    });

    it('should not call next function because validateToken throw a error', async () => {
        validateTokenSpy.mockRejectedValue(new JWTError('Token is invalid'));

        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ token }`
            }
        });

        await checkAuth(req, res, nextMock);

        expect(validateTokenSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.UNAUTHORIZED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });

        expect(req.auth).toBeUndefined();
    });

    it('should not call next function because findByIdUser throw a error', async () => {
        validateTokenSpy.mockResolvedValue(tokenData as any);
        findByIdUserSpy.mockImplementation(() => { throw new Error('Database error') });

        const req = createRequestMock({
            headers: {
                authorization: `Bearer ${ token }`
            }
        });

        await checkAuth(req, res, nextMock);

        expect(validateTokenSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });

        expect(req.auth).toBeUndefined();
    });
});