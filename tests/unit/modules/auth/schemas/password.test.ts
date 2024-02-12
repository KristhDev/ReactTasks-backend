/* Auth */
import { AuthErrorMessages, PasswordSchema } from '@auth';

const data = {
    password: 'test-unit-123',
    confirmPassword: 'test-unit-123'
}

describe('Test in schema password of auth module', () => {
    it('should validate and return values - PasswordSchema', async () => {
        const result = await PasswordSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - PasswordSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual({ ...data, revokeToken: false });
    });

    it('should return error because data is empty - PasswordSchema', async () => {
        const result = await PasswordSchema.safeParseAsync({});

        if (result.success) throw new Error('Result is success - PasswordSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.PASSWORD_REQUIRED);
    });

    it('should return error because data is invalid - PasswordSchema', async () => {
        const result = await PasswordSchema.safeParseAsync({ password: 'sdasdadsadsa', confirmPassword: 'password' });

        if (result.success) throw new Error('Result is success - PasswordSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.PASSWORD_CONFIRMATION);
    })
});