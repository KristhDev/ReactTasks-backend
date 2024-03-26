/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, UserRepository, VerificationRepository } from '@database';

/* Auth */
import { AuthErrorMessages, EmailService } from '@auth';

const sendEmailVerificationSpy = jest.spyOn(EmailService, 'sendEmailVerification')
    .mockImplementation(() => Promise.resolve());

const database = new Database();

describe('Test in Send Email Verification Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send email verification', async () => {
        await UserRepository.deleteOne({ email: 'test-e2e@gmail.com' });

        const newUser = await UserRepository.create({
            name: 'Test',
            lastname: 'Test',
            email: 'test-e2e@gmail.com',
            password: 'test-test-1234',
            verified: false
        });

        const resp = await request
            .post('/api/auth/verify-email')
            .send({ email: newUser.email });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Hemos enviado un correo de verificación, por favor confirma tu cuenta.', 
            status: Http.OK
        });

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailVerificationSpy).toHaveBeenCalledWith({
            email: newUser.email,
            name: newUser.name,
            token: expect.any(String)
        });

        await UserRepository.deleteOne({ id: newUser.id });
        await VerificationRepository.deleteOne({ userId: newUser.id });
    });

    it('should faild because user not found', async () => {
        const resp = await request
            .post('/api/auth/verify-email')
            .send({ email: 'email-not-found@gmail.com' });

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(0);
    });

    it('should faild because user already verified', async () => {
        await UserRepository.deleteOne({ email: 'test-e2e@gmail.com' });

        const newUser = await UserRepository.create({
            name: 'Test',
            lastname: 'Test',
            email: 'test-e2e@gmail.com',
            password: 'test-test-1234',
            verified: true
        });

        const resp = await request
            .post('/api/auth/verify-email')
            .send({ email: newUser.email });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: 'Tu cuenta ya ha sido verificada.',
            status: Http.BAD_REQUEST
        });

        await UserRepository.deleteOne({ id: newUser.id });
    });

    it('should faild because email is invalid', async () => {
        const resp = await request
            .post('/api/auth/verify-email')
            .send({ email: 'invalid-email' });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.EMAIL_INVALID,
            status: Http.BAD_REQUEST
        });
    });
});