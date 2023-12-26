export class ImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ImageError';
    }
}