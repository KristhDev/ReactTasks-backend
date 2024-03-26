/* Mocks */
import { createRequestMock, createResponseMock, userHashedPassMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository, VerificationRepository } from '@database';

/* Auth */
import { EmailService, SignUpController } from '@auth';

const createUserSpy = jest.spyOn(UserRepository, 'create');
const createVerificationSpy = jest.spyOn(VerificationRepository, 'create');
const sendEmailVerificationSpy = jest.spyOn(EmailService, 'sendEmailVerification');

const bodyMock = {
    name: 'John',
    lastname: 'Doe',
    email: 'qOqQI@example.com',
    password: '123456'
}

describe('Test in SignUpController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(SignUpController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        createUserSpy.mockResolvedValue(userHashedPassMock);
        sendEmailVerificationSpy.mockResolvedValue(null as any);
        createVerificationSpy.mockResolvedValue(null as any);

        const req = createRequestMock({ body: bodyMock });

        await SignUpController.handler(req, res);

        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledWith({ ...bodyMock, password: expect.any(String) });

        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            userId: userHashedPassMock.id,
            token: expect.any(String),
            type: 'email',
            expiresIn: expect.any(String)
        });

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailVerificationSpy).toHaveBeenCalledWith({
            email: bodyMock.email,
            name: bodyMock.name,
            token: expect.any(String)
        });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.CREATED);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Te has registrado correctamente. Hemos enviado un correo de verificación al correo que nos proporcionaste, por favor confirma tu cuenta.', 
            status: Http.CREATED
        });
    });

    it('should return internal server error', async () => {
        createUserSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({ body: bodyMock });

        await SignUpController.handler(req, res);

        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledWith({ ...bodyMock, password: expect.any(String) });

        expect(createVerificationSpy).not.toHaveBeenCalled();
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