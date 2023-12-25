import { UploadedFile } from 'express-fileupload';
import { z } from 'zod';

/* Utils */
import { Constants } from '../utils';

export const imageSchema = z.custom<UploadedFile>()
    .refine(data => data !== null, { message: 'La imagen es requerida.' })
    .refine(data => Constants.ACCEPTED_IMAGE_TYPES.includes(data.mimetype), 'La imagen debe tener uno de los siguientes formatos: ' + Constants.ACCEPTED_IMAGE_TYPES.join(', '));