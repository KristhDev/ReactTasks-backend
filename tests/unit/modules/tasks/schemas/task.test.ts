/* Tasks */
import { TaskErrorMessages, statusTaskSchema, storeTaskSchema, updateTaskSchema } from '@tasks';

const data = {
    title: 'Title of task',
    description: 'Description of task',
    deadline: new Date().toISOString()
}

describe('Test in schemas of tasks module', () => {
    it('should validate and return values - storeTaskSchema', async () => {
        const result = await storeTaskSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - storeTaskSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual({ ...data, status: 'pending' });
    });

    it('should return error because data is empty - storeTaskSchema', async () => {
        const result = await storeTaskSchema.safeParseAsync({});

        if (result.success) throw new Error('Result is success - storeTaskSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(TaskErrorMessages.TITLE_REQUIRED);
    });

    it('should return error because data is invalid - storeTaskSchema', async () => {
        const result = await storeTaskSchema.safeParseAsync({ ...data, title: 123 });

        if (result.success) throw new Error('Result is success - storeTaskSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(TaskErrorMessages.TITLE_TYPE);
    });

    it('should validate and return values - updateTaskSchema', async () => {
        const result = await updateTaskSchema.safeParseAsync(data);

        if (!result.success) throw new Error('Result is not success - updateTaskSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(data);
    });

    it('should validate data if it is empty - updateTaskSchema', async () => {
        const result = await updateTaskSchema.safeParseAsync({});

        if (!result.success) throw new Error('Result is not success - updateTaskSchema');

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual({});
    });

    it('should return error because data is invalid - updateTaskSchema', async () => {
        const result = await updateTaskSchema.safeParseAsync({ ...data, title: 123 });

        if (result.success) throw new Error('Result is success - updateTaskSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(TaskErrorMessages.TITLE_TYPE);
    });

    it('should validate and return values - statusTaskSchema', async () => {
        const result = await statusTaskSchema.safeParseAsync({ status: 'pending' });

        if (!result.success) throw new Error('Result is not success - statusTaskSchema');

        expect(result.success).toBeTruthy();
        expect(result.data.status).toBe('pending');
    });

    it('should return error because data is empty - statusTaskSchema', async () => {
        const result = await statusTaskSchema.safeParseAsync({});

        if (result.success) throw new Error('Result is success - statusTaskSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(TaskErrorMessages.STATUS_REQUIRED);
    });

    it('should return error because data is invalid - statusTaskSchema', async () => {
        const result = await statusTaskSchema.safeParseAsync({ status: 'value-no-expected' });

        if (result.success) throw new Error('Result is success - statusTaskSchema');

        expect(result.success).toBeFalsy();
        expect(result.error.errors[0].message).toBe(TaskErrorMessages.STATUS_INVALID);
    });
})