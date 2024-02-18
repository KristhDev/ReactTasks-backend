import { AnyKeys, FilterQuery, MongooseQueryOptions, ProjectionType, QueryOptions } from 'mongoose';

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
     * Delete multiple documents from the database that match the given filter.
     *
     * @param {FilterQuery<VerificationModel>} filter - The filter to apply when deleting documents.
     * @param {Omit<MongooseQueryOptions<VerificationModel>, 'lean' | 'timestamps'>} [options] - The options to use when deleting documents.
     * @return {Promise<void>} A Promise that resolves when the documents are successfully deleted.
     */
    public static async deleteMany(filter: FilterQuery<VerificationModel>, options?: Omit<MongooseQueryOptions<VerificationModel>, 'lean' | 'timestamps'>): Promise<void> {
        try {
            await Verification.deleteMany(filter, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes one document from the verification collection based on the provided filter.
     *
     * @param {FilterQuery<VerificationModel>} filter - The filter to apply for deletion.
     * @param {Omit<MongooseQueryOptions<VerificationModel>, 'lean' | 'timestamps'>} [options] - Optional query options.
     * @return {Promise<void>} - A promise that resolves when the document is deleted successfully.
     */
    public static async deleteOne(filter: FilterQuery<VerificationModel>, options?: Omit<MongooseQueryOptions<VerificationModel>, 'lean' | 'timestamps'>): Promise<void> {
        try {
            await Verification.deleteOne(filter, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single document in the Verification collection that matches the given filter.
     *
     * @param {FilterQuery<VerificationModel>} filter - The filter to apply when searching for the document.
     * @param {ProjectionType<VerificationModel>} [projection] - The fields to include or exclude in the result.
     * @param {QueryOptions<VerificationModel>} [options] - The options to apply when querying the database.
     * @return {Promise<VerificationModel | null>} - A promise that resolves with the matching document, or null if no document is found.
     */
    public static async findOne(
        filter: FilterQuery<VerificationModel>,
        projection?: ProjectionType<VerificationModel>,
        options?: QueryOptions<VerificationModel>
    ): Promise<VerificationModel | null> {
        try {
            return await Verification.findOne(filter, projection, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default VerificationRepository;