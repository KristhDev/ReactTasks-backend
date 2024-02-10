/* Utils */
import Constants from './constants';

export class ImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ImageError';
    }
}

export const ImageErrorMessages = {
    INVALID_URL: 'La URL de la imagen no es valida.',
    INVALID: 'La imagen debe tener uno de los siguientes formatos: ' + Constants.ACCEPTED_IMAGE_TYPES.join(', '),
    ONE_FILE: 'Solo puedes subir una imagen.',
    REQUIRED: 'La imagen es requerida.',
}