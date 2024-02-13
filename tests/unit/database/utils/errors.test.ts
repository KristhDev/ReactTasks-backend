/* Database */
import { DatabaseError, SeederError } from '@database';

describe('Test in errors of database module', () => {
    it('should render properties in error instance - DatabaseError', () => {
        const error = new DatabaseError('database not found');

        expect(error.message).toBe('database not found');
        expect(error.name).toBe('DatabaseError');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(DatabaseError);
    });

    it('should render properties in error instance - SeederError', () => {
        const error = new SeederError('Seeder failed');

        expect(error.message).toBe('Seeder failed');
        expect(error.name).toBe('SeederError');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(SeederError);
    });
});