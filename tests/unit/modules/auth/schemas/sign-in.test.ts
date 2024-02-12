/* Database */
import { Database } from '@database';

/* Auth */
import { AuthErrorMessages, SignInSchema } from '@auth';

const database = new Database();

const data = {
    email: 'tester@gmail.com',
    password: 'tutuyoyo9102'
}

describe('Test in schema sign-in of auth module', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should validate and return values - SignInSchema', async () => {
        const result = await SignInSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - SignInSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(data);
    });

    it('should return error because data is empty - SignInSchema', async () => {
        const result = await SignInSchema.safeParseAsync({});

        if (result.success) throw new Error('Result is success - SignInSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.EMAIL_REQUIRED);
    });

    it('should return error because data is invalid - SignInSchema', async () => {
        const result = await SignInSchema.safeParseAsync({ email: 'email.com', password: 'password' });

        if (result.success) throw new Error('Result is success - SignInSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.EMAIL_INVALID);
    });

    it('should return error because user not found - SignInSchema', async () => {
        const result = await SignInSchema.safeParseAsync({ email: 'tester-not-found@gmail.com', password: 'tutuyoyo9102' });

        if (result.success) throw new Error('Result is success - SignInSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.NOT_FOUND);
    });
});