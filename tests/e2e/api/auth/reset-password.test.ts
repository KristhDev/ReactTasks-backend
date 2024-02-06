/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, UserRepository, VerificationRepository } from '@database';

/* Auth */
import { AuthErrorMessages, EmailService } from '@auth';

const sendEmailResetPasswordSpy = jest.spyOn(EmailService, 'sendEmailResetPassword')
    .mockImplementation(() => Promise.resolve());

describe('Test in Reset Password Endpoint', () => {
    const database = new Database();

    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send email reset password', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await VerificationRepository.deleteOne({ userId: user?._id });

        const resp = await request
            .post('/api/auth/reset-password')
            .send({ email: 'tester@gmail.com' });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Hemos enviado un correo para restablecer tu contraseña, por favor revisalo.',
            status: Http.OK
        });

        expect(sendEmailResetPasswordSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailResetPasswordSpy).toHaveBeenCalledWith({
            email: user?.email,
            name: user?.name,
            token: expect.any(String)
        });

        await VerificationRepository.deleteOne({ userId: user?._id });
    });

    it('should faild user not found', async () => {
        const resp = await request
            .post('/api/auth/reset-password')
            .send({ email: 'tester-not-found@gmail.com' });

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });

        expect(sendEmailResetPasswordSpy).toHaveBeenCalledTimes(0);
    });

    it('should faild because user already unverified', async () => {
        await UserRepository.deleteOne({ email: 'test-e2e@gmail.com' });

        const newUser = await UserRepository.create({
            name: 'Test',
            lastname: 'Test',
            email: 'test-e2e@gmail.com',
            password: 'test-test-1234',
            verified: false
        });

        const resp = await request
            .post('/api/auth/reset-password')
            .send({ email: newUser.email });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNVERIFIED,
            status: Http.BAD_REQUEST
        });

        expect(sendEmailResetPasswordSpy).toHaveBeenCalledTimes(0);

        await UserRepository.deleteOne({ _id: newUser._id });
    });

    it('should faild because email is invalid', async () => {
        const resp = await request
            .post('/api/auth/reset-password')
            .send({ email: 'invalid-email' });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.EMAIL_INVALID,
            status: Http.BAD_REQUEST
        });
    });
});