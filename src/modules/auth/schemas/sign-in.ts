import { z } from 'zod';

/* Server */
import { Logger } from '../../../server';

/* Database */
import { UserRepository } from '../../../database';

/* Utils */
import { AuthErrorMessages } from '../utils';

export const SignInSchema = z.object({
    email: z
        .string({
            required_error: AuthErrorMessages.EMAIL_REQUIRED,
            invalid_type_error: AuthErrorMessages.EMAIL_TYPE
        })
        .email({ message: AuthErrorMessages.EMAIL_INVALID })
        .refine(async (data) => {
            try {
                const user = await UserRepository.findOne({ email: data });
                return !!user;
            } 
            catch (error) {
                Logger.error(`${ (error as any).name }: ${ (error as any).message }`);
                return false;
            }
        }, { message: AuthErrorMessages.NOT_FOUND }),

    password: z
        .string({
            required_error: AuthErrorMessages.PASSWORD_REQUIRED,
            invalid_type_error: AuthErrorMessages.PASSWORD_TYPE
        })
        .min(6, AuthErrorMessages.PASSWORD_MIN_LENGTH)
});