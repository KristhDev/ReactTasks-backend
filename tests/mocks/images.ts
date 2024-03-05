import { UploadedFile } from 'express-fileupload';

export const imageUrlMock = 'https://res.cloudinary.com/dzs8lf9lc/image/upload/v1702530226/react-tasks/tasks/erkntrgjdi15gxmxspdu.jpg';
export const newImageUrlMock = 'https://res.cloudinary.com/dzs8lf9lc/image/upload/v1702530226/react-tasks/tasks/sfkqjvqg9qj9v3v4vq2.jpg';

export const imageMock: UploadedFile = {
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
