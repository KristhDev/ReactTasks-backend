import { UploadedFile } from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

/* Images */
import { ImageError, ImageErrorMessages, ImageService } from '@images';

const file: UploadedFile = {
    data: Buffer.from(''),
    encoding: '',
    md5: '',
    mimetype: '',
    mv: jest.fn(),
    name: '',
    size: 0,
    tempFilePath: 'temp/file/path',
    truncated: false,
}

const cloudinarySecureUrlMock = 'https://res.cloudinary.com/dzs8lf9lc/image/upload/v1702530226/react-tasks/tasks/erkntrgjdi15gxmxspdu.jpg';

const cloudinaryConfigSpy = jest.spyOn(cloudinary, 'config').mockImplementation(jest.fn());
const cloudinaryUploadSpy = jest.spyOn(cloudinary.uploader, 'upload').mockResolvedValue({ secure_url: cloudinarySecureUrlMock } as any);
const cloudinaryDestroySpy = jest.spyOn(cloudinary.uploader, 'destroy').mockImplementation(jest.fn());

describe('Test in ImageService of images module', () => {
    ImageService.initialize();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call initialize wuth correct parameters', () => {
        ImageService.initialize();

        expect(cloudinaryConfigSpy).toHaveBeenCalledTimes(1);
        expect(cloudinaryConfigSpy).toHaveBeenCalledWith({
            api_key: expect.any(String),
            api_secret: expect.any(String),
            cloud_name: expect.any(String)
        });
    });

    it('should call upload with the correct parameters', async () => {
        const image = await ImageService.upload(file, 'test/images');

        expect(cloudinaryUploadSpy).toHaveBeenCalledTimes(1);
        expect(cloudinaryUploadSpy).toHaveBeenCalledWith(file.tempFilePath, { folder: 'test/images' });

        expect(image).toBe(cloudinarySecureUrlMock);
    });

    it('should faild upload because throw error', async () => {
        cloudinaryUploadSpy.mockImplementation(() => { throw 'Upload error' });

        try {
            const image = await ImageService.upload(file, 'test/images');
            expect(image).toBeFalsy();
        } 
        catch (error) {
            expect(cloudinaryUploadSpy).toHaveBeenCalledTimes(1);
            expect(error).toBeInstanceOf(ImageError);
            expect((error as ImageError).message).toBe('Upload error');
        }
    });

    it('should call destroy with the correct parameters', async () => {
        await ImageService.destroy(cloudinarySecureUrlMock);

        const nameArr = cloudinarySecureUrlMock.split('/');
        const appNameIndex = nameArr.findIndex(el => el === 'react-tasks');
        const [ publicId ] = nameArr.slice(appNameIndex, nameArr.length).join('/').split('.');

        expect(cloudinaryDestroySpy).toHaveBeenCalledTimes(1);
        expect(cloudinaryDestroySpy).toHaveBeenCalledWith(publicId);
    });

    it('should faild destroy because url not contains tasks folder', async () => {
        try {
            await ImageService.destroy('https://res.cloudinary.com/dzs8lf9lc/image/upload/v1702530226/other-folder/image.png');
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(cloudinaryDestroySpy).toHaveBeenCalledTimes(0);
            expect(error).toBeInstanceOf(ImageError);
            expect((error as ImageError).message).toBe(ImageErrorMessages.INVALID_URL);
        }
    });

    it('should faild destroy because throw error', async () => {
        cloudinaryDestroySpy.mockImplementation(() => { throw 'Destroy error' });

        try {
            await ImageService.destroy(cloudinarySecureUrlMock);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(cloudinaryDestroySpy).toHaveBeenCalledTimes(1);
            expect(error).toBeInstanceOf(ImageError);
            expect((error as ImageError).message).toBe('Destroy error');
        }
    });
});