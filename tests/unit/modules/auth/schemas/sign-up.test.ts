/* Database */
import { Database } from '@database';

/* Auth */
import { AuthErrorMessages, SignUpSchema } from '@auth';

const database = new Database();

const data = {
    name: 'Tester name',
    lastname: 'Tester lastname',
    email: 'tester-unit@gmail.com',
    password: 'tutuyoyo9102',
    confirmPassword: 'tutuyoyo9102'
}

describe('Test in schema sign-up of auth module', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should validate and return values - SignUpSchema', async () => {
        const result = await SignUpSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - SignUpSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(data);
    });

    it('should return error because data is empty - SignUpSchema', async () => {
        const result = await SignUpSchema.safeParseAsync({});

        if (result.success) throw new Error('Result is success - SignUpSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.NAME_REQUIRED);
    });

    it('should return error because data is invalid - SignUpSchema', async () => {
        const result = await SignUpSchema.safeParseAsync({ ...data, name: 123 });

        if (result.success) throw new Error('Result is success - SignUpSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.NAME_TYPE);
    });

    it('should return error email already exists - SignUpSchema', async () => {
        const result = await SignUpSchema.safeParseAsync({ ...data, email: 'tester@gmail.com' });

        if (result.success) throw new Error('Result is success - SignUpSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.EMAIL_EXISTS);
    });
});