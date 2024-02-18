/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, TokenRepository, UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, JWT, JWTErrorMessages } from '@auth';

const database = new Database();

describe('Test in Update User Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should update authenticated user', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const newName = 'Test1';

        const resp = await request
            .put('/api/auth')
            .set('Authorization', `Bearer ${ token }`)
            .send({ name: newName });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            status: Http.OK,
            msg: 'Has actualizado tus datos correctamente.',
            user: {
                ...UserRepository.endpointAdapter(user!),
                name: newName,
                updatedAt: expect.any(String)
            }
        });

        await UserRepository.findByIdAndUpdate(user!._id, { name: newName });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request
            .put('/api/auth')
            .send({ name: 'Test1' });

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .put('/api/auth')
            .set('Authorization', `Bearer ${ token }`)
            .send({ name: 'Test1' });

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is revoked', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! });

        await JWT.revokeToken(jwt);

        const resp = await request
            .put('/api/auth')
            .set('Authorization', `Bearer ${ jwt }`)
            .send({ name: 'Test1' });

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });

        await TokenRepository.deleteOne({ token: jwt });
    });

    it('should faild because token is expired', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const jwt = JWT.generateToken({ id: user?.id! }, '1s');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const resp = await request
            .put('/api/auth')
            .set('Authorization', `Bearer ${ jwt }`)
            .send({ name: 'Test1' });

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});