/* Setup */
import { request } from '../../../../jest.setup';

/* Database */
import { TokenRepository, UserRepository } from '../../../../src/database';

/* Server */
import { Http } from '../../../../src/server';

/* Modules */
import { JWT, JWTErrorMessages } from '../../../../src/modules/auth';

describe('Test in Tasks Endpoint', () => {
    it('should get tasks of authenticated user', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .get('/api/tasks')
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            status: Http.OK,
            tasks: expect.any(Array),
            pagination: {
                currentPage: expect.any(Number),
                hasNextPage: expect.any(Boolean),
                hasPrevPage: expect.any(Boolean),
                nextPage: expect.any(Number),
                query: expect.any(String),
                totalPages: expect.any(Number)
            }
        });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request.get('/api/tasks');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: 'Necesita ingresar para poder realizar está acción.',
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .get('/api/tasks')
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
            .get('/api/tasks')
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
            .get('/api/tasks')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});