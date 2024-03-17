import { number, z, ZodIssueCode } from 'zod';

/* Tasks */
import { Constants, TaskErrorMessages } from '@tasks';

export const taskSchema = z.object({
    title: z
        .string({
            required_error: TaskErrorMessages.TITLE_REQUIRED,
            invalid_type_error: TaskErrorMessages.TITLE_TYPE 
        })
        .min(5, TaskErrorMessages.TITLE_MIN_LENGTH)
        .refine(data => data && isNaN(Number(data)), { message: TaskErrorMessages.TITLE_TYPE }),

    description: z
        .string({
            required_error: TaskErrorMessages.DESCRIPTION_REQUIRED,
            invalid_type_error: TaskErrorMessages.DESCRIPTION_TYPE
        })
        .min(10, TaskErrorMessages.DESCRIPTION_MIN_LENGTH)
        .refine(data => data && isNaN(Number(data)), { message: TaskErrorMessages.DESCRIPTION_TYPE }),

    deadline: z
        .string({
            required_error: TaskErrorMessages.DEADLINE_REQUIRED,
            invalid_type_error: TaskErrorMessages.DEADLINE_TYPE
        })
        .datetime(TaskErrorMessages.DEADLINE_FORMAT),
});

const zodEnum = <T>(arr: T[]): [ T, ...T[] ] => arr as [ T, ...T[] ];

export const statusTaskSchema = z.object({
    status: z
        .enum(
            zodEnum(Constants.ACCEPTED_TASK_STATUSES),
            { 
                errorMap: (issue, ctx) => {
                    if (issue.code === ZodIssueCode.invalid_enum_value) {
                        return { message: TaskErrorMessages.STATUS_INVALID }
                    }

                    if (issue.code === ZodIssueCode.invalid_type) {
                        return { message: TaskErrorMessages.STATUS_REQUIRED }
                    }

                    return { message: ctx.defaultError };
                }
            }
        )
});

export const storeTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();

