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

describe('Test in Change Status Task Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should change status of task', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await TaskRepository.deleteMany({ userId: user?._id });

        const token = JWT.generateToken({ id: user?.id! });

        const task = await TaskRepository.create({
            title: 'test title',
            description: 'test description',
            userId: user?._id!,
            deadline: new Date().toISOString()
        });

        const resp = await request
            .put(`/api/tasks/${ task?._id }/change-status`)
            .set('Authorization', `Bearer ${ token }`)
            .send({ status: 'completed' });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            status: Http.OK,
            task: {
                ...TaskRepository.endpointAdapter(task),
                status: 'completed',
                updatedAt: expect.any(String)
            }
        });

        await TaskRepository.deleteOne({ _id: task?._id });
    });

    it('should faild because task not found', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .put('/api/tasks/task-not-found/change-status')
            .set('Authorization', `Bearer ${ token }`)
            .send({ status: 'completed' });

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should faild body is invalid', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        await TaskRepository.deleteMany({ userId: user?._id });
        const token = JWT.generateToken({ id: user?.id! });

        const task = await TaskRepository.create({
            title: 'test title',
            description: 'test description',
            userId: user?._id!,
            deadline: new Date().toISOString()
        });

        const resp = await request
            .put(`/api/tasks/${ task?._id }/change-status`)
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.STATUS_REQUIRED,
            status: Http.BAD_REQUEST
        });

        await TaskRepository.deleteOne({ userId: user?._id });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request.put('/api/tasks/user-unauthenticated/change-status');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: AuthErrorMessages.UNAUTHENTICATED,
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .put('/api/tasks/task-exist/change-status')
            .set('Authorization', `Bearer ${ token }`)

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
            .put('/api/tasks/task-exist/change-status')
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

        await new Promise(resolve => setTimeout(resolve, 1000));

        const resp = await request
            .put('/api/tasks/task-exist/change-status')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});