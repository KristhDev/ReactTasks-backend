import { UploadedFile } from 'express-fileupload';

/* Images */
import { ImageErrorMessages, imageSchema } from '@images';

const file: UploadedFile = {
    data: Buffer.from(''),
    encoding: '',
    md5: '',
    mimetype: 'image/png',
    mv: jest.fn(),
    name: '',
    size: 0,
    tempFilePath: 'temp/file/path',
    truncated: false,
}

describe('Test in schemas of images module', () => {
    it('should validate and return values - imageSchema', () => {
        const result = imageSchema.safeParse(file);

        if (!result.success) throw new Error('Result is not success - imageSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(file);
    });

    it('should return error because data is empty - imageSchema', () => {
        const result = imageSchema.safeParse(null);

        if (result.success) throw new Error('Result is success - imageSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(ImageErrorMessages.REQUIRED);
    });

    it('should return error because data is invalid - imageSchema', () => {
        const result = imageSchema.safeParse({ ...file, mimetype: 'invalid' });

        if (result.success) throw new Error('Result is success - imageSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(ImageErrorMessages.INVALID);
    })
});