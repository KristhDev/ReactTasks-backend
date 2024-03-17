import { z } from 'zod';

/* Server */
import { Logger } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages } from '@auth';

export const SignUpSchema = z.object({
    name: z
        .string({
            required_error: AuthErrorMessages.NAME_REQUIRED,
            invalid_type_error: AuthErrorMessages.NAME_TYPE 
        })
        .min(3, AuthErrorMessages.NAME_MIN_LENGTH)
        .refine(data => data && isNaN(Number(data)), { message: AuthErrorMessages.NAME_TYPE }),

    lastname: z
        .string({
            required_error: AuthErrorMessages.LASTNAME_REQUIRED,
            invalid_type_error: AuthErrorMessages.LASTNAME_TYPE
        })
        .min(5, AuthErrorMessages.LASTNAME_MIN_LENGTH)
        .refine(data => data && isNaN(Number(data)), { message: AuthErrorMessages.LASTNAME_TYPE }),

    email: z
        .string({
            required_error: AuthErrorMessages.EMAIL_REQUIRED,
            invalid_type_error: AuthErrorMessages.EMAIL_TYPE
        })
        .email({ message: AuthErrorMessages.EMAIL_INVALID })
        .refine(async (data) => {
            try {
                const user = await UserRepository.findOne({ email: data });
                return !user;
            } 
            catch (error) {
                Logger.error(`${ (error as any).name }: ${ (error as any).message }`);
                return false;
            }
        }, { message: AuthErrorMessages.EMAIL_EXISTS }),

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
})
.refine(data => data.password === data.confirmPassword, {
    message: AuthErrorMessages.PASSWORD_CONFIRMATION,
    path: [ 'confirmPassword' ]
});

export const UserSchema = z.object({
    name: z
        .string({
            required_error: AuthErrorMessages.NAME_REQUIRED,
            invalid_type_error: AuthErrorMessages.NAME_TYPE 
        })
        .min(3, AuthErrorMessages.NAME_MIN_LENGTH)
        .optional(),

    lastname: z
        .string({
            required_error: AuthErrorMessages.LASTNAME_REQUIRED,
            invalid_type_error: AuthErrorMessages.LASTNAME_TYPE
        })
        .min(5, AuthErrorMessages.LASTNAME_MIN_LENGTH)
        .optional()
});