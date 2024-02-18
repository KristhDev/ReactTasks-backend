import { ObjectId, isValidObjectId } from 'mongoose';

class DatabaseValidations {
    /**
     * Validate the provided ID.
     *
     * @param {string | ObjectId} id - the ID to validate
     * @return {boolean} whether the ID is valid
     */
    public static validateId(id: string | ObjectId): boolean {
        return isValidObjectId(id);
    }
}

export default DatabaseValidations;