import { request } from '../../../../jest.setup';

/* Server */
import { Http } from '../../../../src/server';

/* Database */
import { UserRepository } from '../../../../src/database';

const credentials = {
    email: 'tester@gmail.com',
    password: 'tutuyoyo9102'
}

describe('Test in SignIn Endpoint', () => {
    it('should authenticate user with correct credentials', async () => {
        const resp = await request
            .post('/api/auth/signin')
            .send(credentials);

        const user = await UserRepository.findOne({ email: credentials.email });

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Has ingresado correctamente.',
            status: Http.OK,
            user: UserRepository.endpointAdapter(user!),
            token: expect.any(String)
        });
    });

    it('should fail because credentials are invalid', async () => {
        const resp = await request
            .post('/api/auth/signin')
            .send({ email: 'kristhdev@gmail.com', password: 'sdasdasdsad3d' })

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: 'Las credenciales son incorrectas.',
            status: Http.BAD_REQUEST
        });
    });

    it('should fail because request body is invalid', async () => {
        const resp = await request
            .post('/api/auth/signin')
            .send();

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: 'El correo es requerido.',
            status: Http.BAD_REQUEST
        });
    });

    it('should fail because email not found', async () => {
        const resp = await request
            .post('/api/auth/signin')
            .send({ email: 'notfound@gmail.com', password: 'sdasdasdsad3d' });

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: 'El usuario no existe.',
            status: Http.BAD_REQUEST
        });
    });

    it('should fail because user is not verified', async () => {
        const user = await UserRepository.findOne({ email: credentials.email });
        await UserRepository.findByIdAndUpdate(user!._id, { verified: false });

        const resp = await request
            .post('/api/auth/signin')
            .send(credentials);

        expect(resp.status).toBe(Http.BAD_REQUEST);

        expect(resp.body).toEqual({
            msg: 'Tu cuenta no ha sido verificada.',
            status: Http.BAD_REQUEST
        });

        await UserRepository.findByIdAndUpdate(user!._id, { verified: true });
    });
});