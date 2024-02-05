import { AnyKeys, FilterQuery } from 'mongoose';

/* Database */
import { Verification, VerificationModel, DatabaseError } from '@database';

class VerificationRepository {
    /**
     * Creates a new VerificationModel object in the database.
     *
     * @param {AnyKeys<VerificationModel>} data - The data to create the VerificationModel object.
     * @return {Promise<VerificationModel>} A promise that resolves with the created VerificationModel object.
     */
    public static async create(data: AnyKeys<VerificationModel>): Promise<VerificationModel> {
        try {
            return await Verification.create(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes one document from the verification collection based on the provided filter.
     *
     * @param {FilterQuery<VerificationModel>} filter - The filter to apply for deletion.
     * @return {Promise<void>} - A promise that resolves when the document is deleted successfully.
     */
    public static async deleteOne(filter: FilterQuery<VerificationModel>): Promise<void> {
        try {
            await Verification.deleteOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single document in the Verification collection that matches the given filter.
     *
     * @param {FilterQuery<VerificationModel>} filter - The filter to apply when searching for the document.
     * @return {Promise<VerificationModel | null>} - A promise that resolves with the matching document, or null if no document is found.
     */
    public static async findOne(filter: FilterQuery<VerificationModel>): Promise<VerificationModel | null> {
        try {
            return await Verification.findOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default VerificationRepository;