import { UploadedFile } from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

/* Utils */
import { ImageError } from '../utils';

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
     * @return {Promise<string>} The secure URL of the uploaded file.
     */
    public static async upload(file: UploadedFile): Promise<string> {
        try {
            const { secure_url } = await cloudinary.uploader.upload(
                file.tempFilePath,
                { folder: process.env.CLOUDINARY_TASKS_FOLDER }
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
    public static async delete(imgUrl: string): Promise<void> {
        try {
            const nameArr = imgUrl.split('/');
            const name = nameArr[nameArr.length - 1];
            const [ publicId ] = name.split('.');

            await cloudinary.uploader.destroy(`${ process.env.CLOUDINARY_TASKS_FOLDER }/${ publicId }`);
        } 
        catch (error) {
            throw new ImageError(error as string);
        }
    }
}

export default ImageService;