/* Test */
import { request } from '@test';

/* Database */
import { Database, TaskRepository, TokenRepository, UserRepository } from '@database';

/* Server */
import { Http } from '@server';

/* Modules */
import { AuthErrorMessages, JWT, JWTErrorMessages } from '@auth';
import { TaskErrorMessages } from '@tasks';

const database = new Database();

describe('Test in Destroy Task Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should delete task of authenticated user', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });

        await TaskRepository.deleteMany({ userId: user?.id });

        const token = JWT.generateToken({ id: user?.id! });

        const task = await TaskRepository.create({
            title: 'test title',
            description: 'test description',
            userId: user?.id!,
            deadline: new Date().toISOString()
        });

        const resp = await request
            .delete(`/api/tasks/${ task?.id }`)
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Has eliminado la tarea correctamente.',
            status: Http.OK,
            taskId: task?.id.toString(),
        });

        await TaskRepository.deleteOne({ _id: task?.id });
    });

    it('should faild because task not found', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .delete('/api/tasks/task-not-found')
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request.delete('/api/tasks/user-unauthenticated');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .delete('/api/tasks/task-exist')
            .set('Authorization', `Bearer ${ token }`);

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
            .delete('/api/tasks/task-exist')
            .set('Authorization', `Bearer ${ jwt }`);

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
            .delete('/api/tasks/task-exist')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,  
            status: Http.UNAUTHORIZED
        });
    });
});