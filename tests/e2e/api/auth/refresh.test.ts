/* Test */
import { request } from '@test';

/* Database */
import { TokenRepository, UserRepository } from '@database';

/* Server */
import { Http } from '@server';

/* Auth */
import { JWT, JWTErrorMessages } from '@auth';

describe('Test in Refresh Endpoint', () => {
    it('should refresh token', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .get('/api/auth/refresh')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            status: Http.OK,
            token: expect.any(String),
            user: UserRepository.endpointAdapter(user!)
        });

        await Promise.all([
            TokenRepository.deleteOne({ token: jwt }),
            TokenRepository.deleteOne({ token: resp.body.token })
        ]);
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request.get('/api/auth/refresh');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: 'Necesita ingresar para poder realizar está acción.',
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .get('/api/auth/refresh')
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: 'Necesita ingresar para poder realizar está acción.',
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is revoked', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! });

        await JWT.revokeToken(jwt);

        const resp = await request
            .get('/api/auth/refresh')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: 'Necesita ingresar para poder realizar está acción.',
            status: Http.UNAUTHORIZED
        });

        await TokenRepository.deleteOne({ token: jwt });
    });

    it('should faild because token is expired', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! }, '1s');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const resp = await request
            .get('/api/auth/refresh')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});