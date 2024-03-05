/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, TokenRepository, UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, Encrypt, JWT, JWTErrorMessages } from '@auth';

const database = new Database();

const changePasswordBody = {
    password: 'tester-new-password',
    confirmPassword: 'tester-new-password',
}

const oldPassword = 'tutuyoyo9102'

describe('Test in Change Password Endpoint', () => {

    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should change user password', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id });

        await UserRepository.findByIdAndUpdate(user!._id, { password: Encrypt.createHash(oldPassword) });

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`)
            .send(changePasswordBody);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Has cambiado tu contraseña correctamente.',
            status: Http.OK
        });

        await UserRepository.findByIdAndUpdate(user!._id, { password: Encrypt.createHash(oldPassword) });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request
            .put('/api/auth/change-password')
            .send(changePasswordBody);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`)
            .send(changePasswordBody);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is expired', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id }, '1s');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`)
            .send(changePasswordBody);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is revoked', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id });

        await JWT.revokeToken(token);

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`)
            .send(changePasswordBody);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });

        await TokenRepository.deleteOne({ token });
    });

    it('should faild because request body is invalid', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id });

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.PASSWORD_REQUIRED,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because passwords do not match', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id });

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`)
            .send({
                ...changePasswordBody,
                confirmPassword: 'wrong-password'
            });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.PASSWORD_CONFIRMATION,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because new password is the same as old', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id });

        const resp = await request
            .put('/api/auth/change-password')
            .set('Authorization', `Bearer ${ token }`)
            .send({ password: oldPassword, confirmPassword: oldPassword });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.NEW_PASSWORD,
            status: Http.BAD_REQUEST
        });
    });
});