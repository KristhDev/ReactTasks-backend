/* Database */
import { 
    BaseRepository, 
    CreateVerificationData, 
    DatabaseError, 
    VerificationFilter, 
    VerificationModel, 
    VerificationSchema
} from '@database';

/* Auth */
import { Verification } from '@auth';

class VerificationRepository {
    /**
     * Creates a new Verification in the database.
     *
     * @param {CreateVerificationData} data - The data to create the VerificationModel object.
     * @return {Promise<Verification>} A promise that resolves with the created VerificationModel object.
     */
    public static async create(data: CreateVerificationData): Promise<Verification> {
        try {
            const verification = await VerificationSchema.create({ ...data });
            return VerificationRepository.toVerification(verification);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete all expired verifications from the database based on the provided date.
     *
     * @param {string} date - The date indicating the expiration threshold.
     * @return {Promise<void>} A Promise that resolves when the deletions are completed.
     */
    public static async deleteLastExpired(date: string): Promise<void> {
        try {
            await VerificationSchema.deleteMany({ expiresIn: { $lte: date } });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete multiple records from the database that match the given filter.
     *
     * @param {VerificationFilter} filter - The filter to apply when deleting records.
     * @return {Promise<void>} A Promise that resolves when the records are successfully deleted.
     */
    public static async deleteMany(filter: VerificationFilter): Promise<void> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<VerificationFilter>(filter);
            await VerificationSchema.deleteMany({ ...filterParsed });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes one record from the verifications based on the provided filter.
     *
     * @param {VerificationFilter} filter - The filter to apply for deletion.
     */
    public static async deleteOne(filter: VerificationFilter): Promise<void> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<VerificationFilter>(filter);
            await VerificationSchema.deleteOne({ ...filterParsed });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single record in the verifications that matches the given filter.
     *
     * @param {VerificationFilter} filter - The filter to apply when searching for the document.
     * @return {Promise<Verification | null>} - A promise that resolves with the matching document, or null if no document is found.
     */
    public static async findOne(filter: VerificationFilter): Promise<Verification | null> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<VerificationFilter>(filter);

            const verification = await VerificationSchema.findOne({ ...filterParsed });
            if (!verification) return null;

            return VerificationRepository.toVerification(verification);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Converts a VerificationModel object to a Verification object.
     *
     * @param {VerificationModel} verification - the VerificationModel to be converted
     * @return {Verification} the converted Verification object
     */
    private static toVerification(verification: VerificationModel): Verification {
        return {
            id: verification._id.toString(),
            userId: verification.userId,
            token: verification.token,
            type: verification.type,
            expiresIn: verification.expiresIn,
            createdAt: new Date(verification.createdAt!).toISOString(),
            updatedAt: new Date(verification.updatedAt!).toISOString()
        }
    }
}

export default VerificationRepository;