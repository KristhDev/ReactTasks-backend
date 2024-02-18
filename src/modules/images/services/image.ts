import { UploadedFile } from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

/* Images */
import { ImageError, ImageErrorMessages } from '@images';

class ImageService {
    /**
     * Initializes the cloudinary configuration.
     *
     * @param {void} - No parameters needed.
     * @return {void} - No return value.
     */
    public static initialize(): void {
        cloudinary.config({
            api_key: process.env.CLOUDINARY_API_KEY!,
            api_secret: process.env.CLOUDINARY_API_SECRET!,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME!
        });
    }

    /**
     * Uploads a file to Cloudinary and returns the secure URL.
     *
     * @param {UploadedFile} file - The file to be uploaded.
     * @param {string} folder - The folder to upload the file to
     * @return {Promise<string>} The secure URL of the uploaded file.
     */
    public static async upload(file: UploadedFile, folder?: string): Promise<string> {
        try {
            const { secure_url } = await cloudinary.uploader.upload(
                file.tempFilePath,
                { folder }
            );

            return secure_url;
        } 
        catch (error) {
            throw new ImageError(error as string);
        }
    }

    /**
     * Deletes an image from the cloudinary server.
     *
     * @param {string} imgUrl - the URL of the image to be deleted
     * @return {Promise<void>} - a Promise that resolves when the image is deleted
     */
    public static async destroy(imgUrl: string): Promise<void> {
        try {
            const nameArr = imgUrl.split('/');
            const appNameIndex = nameArr.findIndex(el => el === 'react-tasks');

            if (appNameIndex < 0) throw ImageErrorMessages.INVALID_URL;

            const [ publicId ] = nameArr.slice(appNameIndex, nameArr.length).join('/').split('.');

            await cloudinary.uploader.destroy(publicId);
        } 
        catch (error) {
            throw new ImageError(error as string);
        }
    }
}

export default ImageService;