/* Mocks */
import { createRequestMock, createResponseMock, userMock, userVerifiedMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { VerificationRepository } from '@database';

/* Auth */
import { AuthErrorMessages, EmailService, ForgotPasswordController } from '@auth';

const createVerificationSpy = jest.spyOn(VerificationRepository, 'create');
const sendEmailResetPasswordSpy = jest.spyOn(EmailService, 'sendEmailResetPassword')

describe('Test in ForgotPasswordController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(ForgotPasswordController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        createVerificationSpy.mockImplementation(() => Promise.resolve() as any);
        sendEmailResetPasswordSpy.mockImplementation(() => Promise.resolve());

        const req = createRequestMock({ user: userVerifiedMock });

        await ForgotPasswordController.handler(req, res);

        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            userId: userVerifiedMock._id,
            type: 'password',
            expiresIn: expect.any(String),
            token: expect.any(String),
        });

        expect(sendEmailResetPasswordSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailResetPasswordSpy).toHaveBeenCalledWith({
            email: userVerifiedMock.email,
            name: userVerifiedMock.name,
            token: expect.any(String)
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Hemos enviado un correo para restablecer tu contraseña, por favor revisalo.',
            status: Http.OK
        });
    });

    it('should return an error response if user is not verified', async () => {
        const req = createRequestMock({ user: userMock });

        await ForgotPasswordController.handler(req, res);

        expect(createVerificationSpy).not.toHaveBeenCalled();
        expect(sendEmailResetPasswordSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNVERIFIED,
            status: Http.BAD_REQUEST
        });
    });

    it('should return internal server error', async () => {
        createVerificationSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({ user: userVerifiedMock });

        await ForgotPasswordController.handler(req, res);

        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            userId: userVerifiedMock._id,
            type: 'password',
            expiresIn: expect.any(String),
            token: expect.any(String),
        });

        expect(sendEmailResetPasswordSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});