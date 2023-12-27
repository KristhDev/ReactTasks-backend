import { AnyKeys, FilterQuery } from 'mongoose';

/* Models */
import { EmailVerification } from '../models';

/* Interfaces */
import { EmailVerificationModel } from '../interfaces';

/* Utils */
import { DatabaseError } from '../utils';

class EmailVerificationRepository {
    /**
     * Creates a new token in the database.
     *
     * @param {AnyKeys<EmailVerificationModel>} data - The data used to create the token.
     * @return {Promise<EmailVerificationModel>} The newly created token.
     */
    public static async create(data: AnyKeys<EmailVerificationModel>): Promise<EmailVerificationModel> {
        try {
            return await EmailVerification.create(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    public static async deleteOne(filter: FilterQuery<EmailVerificationModel>): Promise<void> {
        try {
            await EmailVerification.deleteOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single token based on the provided filter.
     *
     * @param {FilterQuery<EmailVerificationModel>} filter - The filter used to search for the token.
     * @return {Promise<EmailVerificationModel | null>} A promise that resolves to the found token, or null if no token is found.
     */
    public static async findOne(filter: FilterQuery<EmailVerificationModel>): Promise<EmailVerificationModel | null> {
        try {
            return await EmailVerification.findOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default EmailVerificationRepository;