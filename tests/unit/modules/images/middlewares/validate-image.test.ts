import { UploadedFile } from 'express-fileupload';

/* Mocks */
import { createRequestMock, createResponseMock } from '@mocks';

/* Server */
import { Http } from '@server';

/* Images */
import { ImageErrorMessages, validateImage } from '@images';

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

describe('Test in middleware validateImage of images module', () => {
    const { mockClear, next: nextMock, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should call next function', () => {
        const req = createRequestMock({
            files: { image: file }
        });

        validateImage(req, res, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should call next function if image is not provided', () => {
        const req = createRequestMock();

        validateImage(req, res, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function if image is an array', () => {
        const req = createRequestMock({
            files: { image: [ file ] }
        });

        validateImage(req, res, nextMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ImageErrorMessages.ONE_FILE,
            status: Http.BAD_REQUEST
        });

        expect(nextMock).not.toHaveBeenCalled();
    });

    it('should not call next function if image is invalid', () => {
        const req = createRequestMock({
            files: { image: { ...file, mimetype: 'image/gif' } }
        });

        validateImage(req, res, nextMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ImageErrorMessages.INVALID,
            status: Http.BAD_REQUEST
        });

        expect(nextMock).not.toHaveBeenCalled();
    });
});