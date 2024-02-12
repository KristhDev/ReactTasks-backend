/* Auth */
import { AuthErrorMessages, EmailSchema } from '@auth';

const data = {
    email: 'test-unit@gmail.com'
}

describe('Test in schema email of auth module', () => {
    it('should validate and return values - EmailSchema', async () => {
        const result = await EmailSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - EmailSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(data);
    });

    it('should return error because data is empty - EmailSchema', async () => {
        const result = await EmailSchema.safeParseAsync({});

        if (result.success) throw new Error('Result is success - EmailSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.EMAIL_REQUIRED);
    });

    it('should return error because data is invalid - EmailSchema', async () => {
        const result = await EmailSchema.safeParseAsync({ email: 'email.com' });

        if (result.success) throw new Error('Result is success - EmailSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.EMAIL_INVALID);
    });
});