import { UploadedFile } from 'express-fileupload';
import { z } from 'zod';

/* Images */
import { Constants, ImageErrorMessages } from '@images';

export const imageSchema = z.custom<UploadedFile>()
    .refine(data => data !== null, { message: ImageErrorMessages.REQUIRED })
    .refine(data => Constants.ACCEPTED_IMAGE_TYPES.includes(data.mimetype), ImageErrorMessages.INVALID);