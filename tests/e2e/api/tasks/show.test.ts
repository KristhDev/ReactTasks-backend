/* Setup */
import { request } from '../../../../jest.setup';

/* Database */
import { TaskRepository, TokenRepository, UserRepository } from '../../../../src/database';

/* Server */
import { Http } from '../../../../src/server';

/* Modules */
import { JWT, JWTErrorMessages } from '../../../../src/modules/auth';
import { TaskErrorMessages } from '../../../../src/modules/tasks';

describe('Test in Show Task Endpoint', () => {
    it('should get task of authenticated user', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const task = await TaskRepository.create({
            userId: user?._id!,
            title: 'test',
            description: 'test',
            deadline: new Date().toISOString(),
        });

        const resp = await request
        .get(`/api/tasks/${ task?._id }`)
        .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.OK);

        const taskEndpoint = TaskRepository.endpointAdapter(task);
        delete taskEndpoint.image;

        expect(resp.body).toEqual({
            status: Http.OK,
            task: taskEndpoint
        });

        await TaskRepository.deleteOne({ _id: task?._id });
    });

    it('should faild because task not found', async () => {
        const user = await UserRepository.findOne({ email: 'tester@gmail.com' });
        const token = JWT.generateToken({ id: user?.id! });

        const resp = await request
            .get('/api/tasks/task-not-found')
            .set('Authorization', `Bearer ${ token }`);

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: TaskErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should faild because user is unauthenticated', async () => {
        const resp = await request.get('/api/tasks/user-unauthenticated');

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: 'Necesita ingresar para poder realizar está acción.',
            status: Http.UNAUTHORIZED
        });
    });

    it('should faild because token is invalid', async () => {
        const token = 'invalid';

        const resp = await request
            .get('/api/tasks/task-not-found')
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
            .get('/api/tasks/token-revoked')
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
            .get('/api/tasks/token-expired')
            .set('Authorization', `Bearer ${ jwt }`);

        expect(resp.status).toBe(Http.UNAUTHORIZED);

        expect(resp.body).toEqual({
            msg: JWTErrorMessages.EXPIRED,
            status: Http.UNAUTHORIZED
        });
    });
});