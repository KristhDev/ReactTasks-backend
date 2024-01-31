import { z } from 'zod';

/* Utils */
import { AuthErrorMessages } from '../utils';

export const PasswordSchema = z.object({
    password: z
        .string({
            required_error: AuthErrorMessages.PASSWORD_REQUIRED,
            invalid_type_error: AuthErrorMessages.PASSWORD_TYPE
        })
        .min(6, AuthErrorMessages.PASSWORD_MIN_LENGTH),

    confirmPassword: z
        .string({
            required_error: AuthErrorMessages.PASSWORD_REQUIRED,
            invalid_type_error: AuthErrorMessages.PASSWORD_TYPE
        })
        .min(6, AuthErrorMessages.PASSWORD_MIN_LENGTH),

    revokeToken: z
        .boolean()
        .default(false)
})
.refine(data => data.password === data.confirmPassword, {
    message: AuthErrorMessages.PASSWORD_CONFIRMATION,
    path: [ 'confirmPassword' ]
})