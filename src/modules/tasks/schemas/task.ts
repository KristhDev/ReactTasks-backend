import { z, ZodIssueCode } from 'zod';

export const taskSchema = z.object({
    title: z
        .string({
            required_error: 'El titulo es requerido.',
            invalid_type_error: 'El titulo debe ser una cadena.' 
        })
        .min(5, 'El titulo debe tener al menos 5 caracteres.'),

    description: z
        .string({
            required_error: 'La descripción es requerida.',
            invalid_type_error: 'La descripción debe ser una cadena.'
        })
        .min(10, 'La descripción debe tener al menos 10 caracteres.'),

    deadline: z
        .string({
            required_error: 'La fecha de finalización es requerida.',
            invalid_type_error: 'La fecha de finalización debe ser una cadena.'
        })
        .datetime('La fecha de entrega debe ser una fecha.'),
});


export const statusTaskSchema = z.object({
    status: z
        .enum(
            [ 'pending', 'completed', 'in-progress' ],
            { 
                errorMap: (issue, ctx) => {
                    if (issue.code === ZodIssueCode.invalid_enum_value) {
                        return { message: 'El estado debe ser uno de los siguientes: pending, completed o in-progress.' }
                    }

                    if (issue.code === ZodIssueCode.invalid_type) {
                        return { message: 'El estado es requerido.' }
                    }

                    return { message: ctx.defaultError };
                }
            }
        )
});

export const storeTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();

