/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, TaskRepository, TokenRepository, UserRepository } from '@database';

/* Modules */
import { AuthErrorMessages, JWT, JWTErrorMessages } from '@auth';
import { TaskErrorMessages } from '@tasks';

const data = {
    title: 'Test description',
    description: 'Test description',
    deadline: new Date().toISOString()
}

const database = new Database();

describe('Test in Store Task Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should create task of authenticated user', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await TaskRepository.deleteOne({ userId: user?.id });

        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .post('/api/tasks')
            .set('Authorization', `Bearer ${ token }`)
            .send(data);

        expect(resp.status).toBe(Http.CREATED);

        expect(resp.body).toEqual({
            msg: 'Has agregado la tarea correctamente.',
            status: Http.CREATED,
            task: {
                id: expect.any(String),
                userId: user?.id,
                ...data,
                image: '',
                status: 'pending',
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        });

        await TaskRepository.deleteOne({ userId: user?.id });
    });

    it('should faild because body is empty', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .post('/api/tasks')
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.TITLE_REQUIRED,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because body is invalid', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .post('/api/tasks')
            .set('Authorization', `Bearer ${ token }`)
            .send({
                ...data,
                title: 123
            });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.TITLE_TYPE,
            status: Http.BAD_REQUEST
        });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request
            .post('/api/tasks')
            .send(data);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .post('/api/tasks')
            .set('Authorization', `Bearer ${ token }`)
            .send(data);

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
            .post('/api/tasks')
            .set('Authorization', `Bearer ${ jwt }`)
            .send(data);

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
            .post('/api/tasks')
            .set('Authorization', `Bearer ${ jwt }`)
            .send(data);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});