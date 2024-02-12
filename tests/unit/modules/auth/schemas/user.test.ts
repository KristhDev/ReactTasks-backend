/* Auth */
import { AuthErrorMessages, UserSchema } from '@auth';

const data = {
    name: 'Tester name',
    lastname: 'Tester lastname',
}

describe('Test in schema user of auth module', () => {
    it('should validate and return values - UserSchema', async () => {
        const result = await UserSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - UserSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(data);
    });

    it('should return data if it is empty - UserSchema', async () => {
        const result = await UserSchema.safeParseAsync({});

        if (!result.success) throw new Error('Result is not success - UserSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual({});
    });

    it('should return error because data is invalid - UserSchema', async () => {
        const result = await UserSchema.safeParseAsync({ ...data, name: 123 });

        if (result.success) throw new Error('Result is success - UserSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(AuthErrorMessages.NAME_TYPE);
    });
});