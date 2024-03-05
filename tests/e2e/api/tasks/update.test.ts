/* Test */
import { request } from '@test';

/* Server */
import { Http } from '@server';

/* Database */
import { Database, TaskRepository, TokenRepository, UserRepository } from '@database';

/* Modules */
import { AuthErrorMessages, JWT, JWTErrorMessages } from '@auth';
import { TaskErrorMessages } from '@tasks';

const database = new Database();

const data = {
    title: 'Test',
    description: 'Test description',
    deadline: new Date().toISOString()
}

describe('Test in Update Task Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should update task of authenticated user', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await TaskRepository.deleteMany({ userId: user?._id });

        const task = await TaskRepository.create({
            ...data,
            userId: user?._id
        });

        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .put(`/api/tasks/${ task.id }`)
            .set('Authorization', `Bearer ${ token }`)
            .send({ title: data.description });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Has actualizado la tarea correctamente.',
            status: Http.OK,
            task: {
                ...TaskRepository.endpointAdapter(task),
                title: data.description,
                updatedAt: expect.any(String)
            }
        });

        await TaskRepository.deleteOne({ userId: user?._id });
    });

    it('should update task with empty body', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await TaskRepository.deleteMany({ userId: user?._id });

        const task = await TaskRepository.create({
            ...data,
            userId: user?._id
        });

        const token = JWT.generateToken({ id: user?._id });

        const resp = await request
            .put(`/api/tasks/${ task.id }`)
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Has actualizado la tarea correctamente.',
            status: Http.OK,
            task: {
                ...TaskRepository.endpointAdapter(task),
                updatedAt: expect.any(String)
            }
        });

        await TaskRepository.deleteOne({ userId: user?._id });
    });

    it('should faild because task not found', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?._id });

        const resp = await request
            .put('/api/tasks/task-not-found')
            .set('Authorization', `Bearer ${ token }`)
            .send({ title: data.description });

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should faild because body is invalid', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await TaskRepository.deleteMany({ userId: user?._id });

        const task = await TaskRepository.create({
            ...data,
            userId: user?._id
        });

        const token = JWT.generateToken({ id: user?._id });

        const resp = await request
            .put(`/api/tasks/${ task.id }`)
            .set('Authorization', `Bearer ${ token }`)
            .send({ title: 123 });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.TITLE_TYPE,
            status: Http.BAD_REQUEST
        });

        await TaskRepository.deleteOne({ userId: user?._id });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request
            .put('/api/tasks/task-id')
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
            .put('/api/tasks/task-id')
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
            .put('/api/tasks/task-id')
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
            .put('/api/tasks/task-id')
            .set('Authorization', `Bearer ${ jwt }`)
            .send(data);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});