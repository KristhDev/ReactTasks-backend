/* Mocks */
import { imageMock } from '@mocks';

/* Images */
import { ImageErrorMessages, imageSchema } from '@images';

describe('Test in schemas of images module', () => {
    it('should validate and return values - imageSchema', () => {
        const result = imageSchema.safeParse(imageMock);

        if (!result.success) throw new Error('Result is not success - imageSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(imageMock);
    });

    it('should return error because data is empty - imageSchema', () => {
        const result = imageSchema.safeParse(null);

        if (result.success) throw new Error('Result is success - imageSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(ImageErrorMessages.REQUIRED);
    });

    it('should return error because data is invalid - imageSchema', () => {
        const result = imageSchema.safeParse({ ...imageMock, mimetype: 'invalid' });

        if (result.success) throw new Error('Result is success - imageSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(ImageErrorMessages.INVALID);
    })
});