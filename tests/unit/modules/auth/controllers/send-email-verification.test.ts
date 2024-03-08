/* Mocks */
import { createRequestMock, createResponseMock, userMock, userVerifiedMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { VerificationRepository } from '@database';

/* Auth */
import { EmailService, SendEmailVerificationController } from '@auth';

const createVerificationSpy = jest.spyOn(VerificationRepository, 'create');
const sendEmailVerificationSpy = jest.spyOn(EmailService, 'sendEmailVerification');

describe('Test in SendEmailVerificationController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(SendEmailVerificationController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        createVerificationSpy.mockImplementation(() => Promise.resolve() as any);
        sendEmailVerificationSpy.mockImplementation(() => Promise.resolve());

        const req = createRequestMock({ user: userMock });

        await SendEmailVerificationController.handler(req, res);

        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            expiresIn: expect.any(String),
            token: expect.any(String),
            type: 'email',
            userId: userMock._id
        });

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailVerificationSpy).toHaveBeenCalledWith({
            email: userMock.email,
            name: userMock.name,
            token: expect.any(String)
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Hemos enviado un correo de verificación, por favor confirma tu cuenta.', 
            status: Http.OK
        });
    });

    it('should return a bad request because user already verified', async () => {
        const req = createRequestMock({ user: userVerifiedMock });

        await SendEmailVerificationController.handler(req, res);

        expect(createVerificationSpy).not.toHaveBeenCalled();
        expect(sendEmailVerificationSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Tu cuenta ya ha sido verificada.',
            status: Http.BAD_REQUEST
        });
    });

    it('should return internal server error', async () => {
        createVerificationSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({ user: userMock });

        await SendEmailVerificationController.handler(req, res);

        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            expiresIn: expect.any(String),
            token: expect.any(String),
            type: 'email',
            userId: userMock._id
        });

        expect(sendEmailVerificationSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});