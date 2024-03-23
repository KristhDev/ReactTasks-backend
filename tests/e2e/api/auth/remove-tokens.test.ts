/* Test */
import { request } from '@test';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { Database } from '@database';

const database = new Database();

describe('Test in Remove Tokens Endpoint', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should remove expired tokens of all users', async () => {
        const resp = await request
            .post('/api/auth/remove-tokens')
            .set('Authorization', `Bearer ${ process.env.AUTH_SECRET! }`);

        expect(resp.status).toBe(Http.OK);

        expect(resp.body).toEqual({
            msg: 'Se eliminaron todos los tokens expirados correctamente.',
            status: Http.OK
        });
    });

    it('should faild because token isnt provided', async () => {
        const resp = await request.post('/api/auth/remove-tokens');

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: ServerErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });

    it('should faild because token is invalid', async () => {
        const resp = await request
            .post('/api/auth/remove-tokens')
            .set('Authorization', 'Bearer invalid');

        expect(resp.status).toBe(Http.NOT_FOUND);

        expect(resp.body).toEqual({
            msg: ServerErrorMessages.NOT_FOUND,
            status: Http.NOT_FOUND
        });
    });
});