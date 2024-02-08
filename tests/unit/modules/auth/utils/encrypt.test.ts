import { Encrypt } from '@auth';

describe('Test in util Encrypt of auth module', () => {
    it('should create a hash from the given value', () => {
        const value = 'test-hash';
        const hash = Encrypt.createHash(value);

        expect(hash).not.toBe(value);
        expect(hash.length).toBeGreaterThan(value.length);
    });

    it('should compare a value with a hash and return true if they match, false otherwise', () => {
        const value = 'test-hash';
        const hash = Encrypt.createHash(value);

        const match = Encrypt.compareHash(value, hash);
        const noMatch = Encrypt.compareHash('wrong-value', hash);

        expect(match).toBeTruthy();
        expect(noMatch).toBeFalsy();
    });
});