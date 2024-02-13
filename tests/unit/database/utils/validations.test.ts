/* Database */
import { DatabaseValidations } from '@database';

describe('Test in util Validations of database module', () => {
    it('should validate the provided ID', () => {
        const invalidId = '123';
        const validId = '65cab5be9412635fb5b0bf5e';

        expect(DatabaseValidations.validateId(invalidId)).toBeFalsy();
        expect(DatabaseValidations.validateId(validId)).toBeTruthy();
    });
});