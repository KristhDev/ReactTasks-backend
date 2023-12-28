import { z } from 'zod';

export const EmailSchema = z.object({
    email: z
        .string({
            required_error: 'El correo es requerido.',
            invalid_type_error: 'El correo debe ser una cadena.'
        })
        .email({ message: 'El correo no es valido.' })
});