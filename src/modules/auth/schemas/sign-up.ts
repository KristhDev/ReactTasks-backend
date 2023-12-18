import { z } from 'zod';

/* User */
import { User } from '../../../database';

export const SignUpSchema = z.object({
    name: z
        .string({
            required_error: 'El nombre es requerido.',
            invalid_type_error: 'El nombre debe ser una cadena.' 
        })
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),

    email: z
        .string({
            required_error: 'El correo es requerido.',
            invalid_type_error: 'El correo debe ser una cadena.'
        })
        .email({ message: 'El correo no es valido.' })
        .refine(async (data) => {
            const user = await User.findOne({ email: data });
            return !user;
        }, { message: 'El correo ya existe.' }),

    password: z
        .string({
            required_error: 'La contraseña es requerida.',
            invalid_type_error: 'La contraseña debe ser una cadena.'
        })
        .min(6, 'La contraseña debe tener al menos 6 caracteres.'),

    confirmPassword: z
        .string({
            required_error: 'La confirmación de la contraseña es requerida.',
            invalid_type_error: 'La confirmación de la contraseña debe ser una cadena.'
        })
        .min(6, 'La confirmación de la contraseña debe tener al menos 6 caracteres.')
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword']
})