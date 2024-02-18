import bcrypt from 'bcryptjs';

class Encrypt {
    /**
     * Creates a hash from the given value using an optional salt.
     *
     * @param {string} value - the value to be hashed
     * @param {number | string} [salt] - an optional salt
     * @return {string} the hashed value
     */
    public static createHash(value: string, salt?: number | string): string {
        return bcrypt.hashSync(value, salt);
    }

    /**
     * Compare a value with a hash and return true if they match, false otherwise.
     *
     * @param {string} value - the value to compare
     * @param {string} hash - the hash to compare against
     * @return {boolean} true if the value matches the hash, false otherwise
     */
    public static compareHash(value: string, hash: string): boolean {
        return bcrypt.compareSync(value, hash);
    }
}

export default Encrypt;