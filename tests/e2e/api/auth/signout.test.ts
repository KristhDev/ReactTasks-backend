/* Test */
import { request } from '@test';

/* Database */
import { Database, TokenRepository, UserRepository } from '@database';

/* Server */
import { Http } from '@server';

/* Auth */
import { AuthErrorMessages, JWT } from '@auth';

describe('Test in SignOut Endpoint', () => {
    beforeAll(async () => {
        const database = new Database();
        await database.connect();
    });

    afterAll(async () => {
        const database = new Database();
        await database.disconnect();
    });

    it('should revoke token to close session', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .post('/api/auth/signout')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Has cerrado sesión correctamente.',
            status: Http.OK
        });

        const token = await TokenRepository.findOne({ token: jwt });
        expect(!!token).toBeTruthy();

        await TokenRepository.deleteOne({ token: jwt });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request.post('/api/auth/signout');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const resp = await request
            .post('/api/auth/signout')
            .set('Authorization', 'Bearer invalid');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should fail because token is revoked', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! });

        await JWT.revokeToken(jwt);

        const resp = await request
            .post('/api/auth/signout')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });

        await TokenRepository.deleteOne({ token: jwt });
    });

    it('should fail because token is expired', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! }, '1s');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const resp = await request
            .post('/api/auth/signout')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: 'Su tiempo de sesión ha expirado. Por favor, inicie sesión de nuevo.',
            status: Http.UNAUTHORIZED
        });

        await TokenRepository.deleteOne({ token: jwt });
    });
});