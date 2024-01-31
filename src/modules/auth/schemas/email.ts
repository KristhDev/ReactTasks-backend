import { z } from 'zod';

/* Utils */
import { AuthErrorMessages } from '../utils';

export const EmailSchema = z.object({
    email: z
        .string({
            required_error: AuthErrorMessages.EMAIL_REQUIRED,
            invalid_type_error: AuthErrorMessages.EMAIL_TYPE
        })
        .email({ message: AuthErrorMessages.EMAIL_INVALID })
});