/* Mocks */
import { createRequestMock, createResponseMock, passwordOfUserHashedMock, userVerfiedHashedPassMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, ChangePasswordController, JWT } from '@auth';

const revokeTokenSpy = jest.spyOn(JWT, 'revokeToken');
const findByIdAndUpdateUserSpy = jest.spyOn(UserRepository, 'findByIdAndUpdate');
const newPassword = 'new-password-test';
const token = JWT.generateToken({ id: userVerfiedHashedPassMock.id });

describe('Test in ChangePasswordController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(ChangePasswordController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        findByIdAndUpdateUserSpy.mockImplementation(() => Promise.resolve() as any);

        const req = createRequestMock({
            auth: {
                user: userVerfiedHashedPassMock,
                token
            },
            body: { password: newPassword }
        });

        await ChangePasswordController.handler(req, res);

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userVerfiedHashedPassMock.id, { password: expect.any(String) });

        expect(revokeTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has cambiado tu contraseña correctamente.',
            status: Http.OK
        });
    });

    it('should call revokeToken of JWT if revokeToken is true', async () => {
        revokeTokenSpy.mockImplementation(() => Promise.resolve() as any);

        const req = createRequestMock({
            auth: {
                user: userVerfiedHashedPassMock,
                token
            },
            body: { password: newPassword, revokeToken: true }
        });

        await ChangePasswordController.handler(req, res);

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userVerfiedHashedPassMock.id, { password: expect.any(String) });

        expect(revokeTokenSpy).toHaveBeenCalledTimes(1);
        expect(revokeTokenSpy).toHaveBeenCalledWith(token);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has cambiado tu contraseña correctamente.',
            status: Http.OK
        });
    });

    it('should return bad request if password is equal to old', async () => {
        findByIdAndUpdateUserSpy.mockImplementation(() => Promise.resolve() as any);

        const req = createRequestMock({
            auth: {
                user: userVerfiedHashedPassMock,
                token
            },
            body: { password: passwordOfUserHashedMock }
        });

        await ChangePasswordController.handler(req, res);

        expect(findByIdAndUpdateUserSpy).not.toHaveBeenCalled();
        expect(revokeTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.NEW_PASSWORD,
            status: Http.BAD_REQUEST
        });
    });

    it('should return internal server error', async () => {
        findByIdAndUpdateUserSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({
            auth: {
                user: userVerfiedHashedPassMock,
                token
            },
            body: { password: newPassword }
        });

        await ChangePasswordController.handler(req, res);

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userVerfiedHashedPassMock.id, { password: expect.any(String) });

        expect(revokeTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});