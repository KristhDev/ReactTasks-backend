import { z } from 'zod';

export const PasswordSchema = z.object({
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
        .min(6, 'La confirmación de la contraseña debe tener al menos 6 caracteres.'),

    revokeToken: z
        .boolean()
        .default(false)
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: [ 'confirmPassword' ]
})