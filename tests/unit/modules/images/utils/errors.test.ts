import { ImageError, ImageErrorMessages } from '@images';

describe('Test in util errors of images module', () => {
    it('should to match snapshot - ImageErrorMessages', () => {
        expect(ImageErrorMessages).toMatchSnapshot();
    });

    it('should render properties in error instance - ImageError', () => {
        const error = new ImageError('file is not an image');

        expect(error.message).toBe('file is not an image');
        expect(error.name).toBe('ImageError');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ImageError);
    });
})