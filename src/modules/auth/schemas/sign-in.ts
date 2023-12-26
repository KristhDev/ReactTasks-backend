import { z } from 'zod';

/* Server */
import { Logger } from '../../../server';

/* Database */
import { UserRepository } from '../../../database';

export const SignInSchema = z.object({
    email: z
        .string({
            required_error: 'El correo es requerido.',
            invalid_type_error: 'El correo debe ser una cadena.'
        })
        .email({ message: 'El correo no es valido.' })
        .refine(async (data) => {
            try {
                const user = await UserRepository.findOne({ email: data });
                return !!user;
            } 
            catch (error) {
                Logger.error(`${ (error as any).name }: ${ (error as any).message }`);
                return false;
            }
        }, { message: 'El usuario no existe.' }),

    password: z
        .string({
            required_error: 'La contraseña es requerida.',
            invalid_type_error: 'La contraseña debe ser una cadena.'
        })
        .min(6, 'La contraseña debe tener al menos 6 caracteres.')
});