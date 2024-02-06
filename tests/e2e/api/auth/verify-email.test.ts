import { request } from '@test';

import { Http } from '@server';

import { Database, UserRepository, VerificationRepository } from '@database';

import { JWT, VerificationsErrorMessages } from '@auth';

describe('Test in Verify Email Endpoint', () => {
    const database = new Database();

    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should verify email of user', async () => {
        await UserRepository.deleteOne({ email: 'test-e2e@gmail.com' });

        const newUser = await UserRepository.create({
            name: 'Test',
            lastname: 'Test',
            email: 'test-e2e@gmail.com',
            password: 'test-test-1234',
            verified: false
        });

        const token = JWT.generateToken({ nothing: 'Nothing' }, '30m');
        const data = JWT.decodeToken(token);
        const expiresIn = new Date(data?.exp! * 1000).toISOString();

        await VerificationRepository.create({ userId: newUser?._id, token, type: 'email', expiresIn });

        const resp = await request
            .get('/api/auth/verify-email')
            .query({ token });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Haz verificado tu cuenta correctamente, ya puedes iniciar sesión.',
            status: Http.OK
        });

        await UserRepository.deleteOne({ _id: newUser._id });
        await VerificationRepository.deleteOne({ userId: newUser._id });
    });

    it('should faild because token isnt provided', async () => {
        const resp = await request.get('/api/auth/verify-email');

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: VerificationsErrorMessages.UNPROCESSED,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because token is invalid', async () => {
        const resp = await request
            .get('/api/auth/verify-email')
            .query({ token: 'invalid-token' });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: VerificationsErrorMessages.UNPROCESSED,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because token is expired', async () => {
        await UserRepository.deleteOne({ email: 'test-e2e@gmail.com' });

        const newUser = await UserRepository.create({
            name: 'Test',
            lastname: 'Test',
            email: 'test-e2e@gmail.com',
            password: 'test-test-1234',
            verified: false
        });

        const token = JWT.generateToken({ nothing: 'Nothing' }, '1s');
        const data = JWT.decodeToken(token);
        const expiresIn = new Date(data?.exp! * 1000).toISOString();

        await VerificationRepository.create({ userId: newUser?._id, token, type: 'email', expiresIn });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const resp = await request
            .get('/api/auth/verify-email')
            .query({ token });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: VerificationsErrorMessages.EXPIRED,
            status: Http.BAD_REQUEST
        });

        await UserRepository.deleteOne({ _id: newUser._id });
        await VerificationRepository.deleteOne({ userId: newUser._id });
    });
});