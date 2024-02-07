/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, UserRepository, VerificationRepository } from '@database';

/* Auth */
import { AuthErrorMessages, EmailService } from '@auth';

const data = {
    name: 'Test',
    lastname: 'Tester-2e2',
    email: 'tester-new@gmail.com',
    password: 'tutuyoyo9102',
    confirmPassword: 'tutuyoyo9102'
}

const sendEmailVerificationSpy = jest.spyOn(EmailService, 'sendEmailVerification')
    .mockImplementation(() => Promise.resolve());

const database = new Database();

describe('Test in SignUp Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create new user', async () => {
        await UserRepository.deleteOne({ email: data.email });

        const resp = await request
            .post('/api/auth/signup')
            .send(data);

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailVerificationSpy).toHaveBeenCalledWith({
            email: data.email,
            name: data.name,
            token: expect.any(String) 
        });

        expect(resp.status).toBe(Http.CREATED);

        expect(resp.body).toEqual({
            msg: 'Te has registrado correctamente. Hemos enviado un correo de verificación al correo que nos proporcionaste, por favor confirma tu cuenta.',
            status: Http.CREATED
        });

        const user = await UserRepository.findOne({ email: data.email });
        await VerificationRepository.deleteOne({ userId: user?._id });
        await UserRepository.deleteOne({ email: data.email });
    });

    it('should faild because body is empty', async () => {
        const resp = await request.post('/api/auth/signup');

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(0);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.NAME_REQUIRED,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because passwords do not match', async () => {
        const resp = await request
            .post('/api/auth/signup')
            .send({ ...data, confirmPassword: 'tutuyoyo9103' });

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(0);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.PASSWORD_CONFIRMATION,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because user already exists', async () => {
        const resp = await request
            .post('/api/auth/signup')
            .send({ ...data, email: 'tester@gmail.com' });

        expect(sendEmailVerificationSpy).toHaveBeenCalledTimes(0);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.EMAIL_EXISTS,
            status: Http.BAD_REQUEST
        });
    });
});