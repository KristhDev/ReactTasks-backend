import { AnyKeys, FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

/* Database */
import { DatabaseError, Token, TokenModel } from '@database';

class TokenRepository {
    /**
     * Creates a new token in the database.
     *
     * @param {AnyKeys<TokenModel>} data - The data used to create the token.
     * @return {Promise<TokenModel>} The newly created token.
     */
    public static async create(data: AnyKeys<TokenModel>): Promise<TokenModel> {
        try {
            return await Token.create(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Asynchronously deletes multiple documents from the database that match the given filter query.
     *
     * @param {FilterQuery<TokenModel>} filter - The filter query to match documents for deletion
     * @param {QueryOptions<TokenModel>} [options] - Optional query options
     * @return {Promise<void>} A promise that resolves when the deletion is successful
     */
    public static async deleteMany(filter: FilterQuery<TokenModel>, options?: QueryOptions<TokenModel>): Promise<void> {
        try {
            await Token.deleteMany(filter, options);
        }
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes one token based on the provided filter query.
     *
     * @param {FilterQuery<TokenModel>} filter - the filter query for deleting the token
     * @param {QueryOptions<TokenModel>} [options] - Optional query options
     * @return {Promise<void>} a Promise that resolves with no value upon successful deletion
     */
    public static async deleteOne(filter: FilterQuery<TokenModel>, options?: QueryOptions<TokenModel>): Promise<void> {
        try {
            await Token.deleteOne(filter, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single token based on the provided filter.
     *
     * @param {FilterQuery<TokenModel>} filter - The filter used to search for the token.
     * @return {Promise<TokenModel | null>} A promise that resolves to the found token, or null if no token is found.
     */
    public static async findOne(
        filter: FilterQuery<TokenModel>,
        projection?: ProjectionType<TokenModel>,
        options?: QueryOptions<TokenModel>
    ): Promise<TokenModel | null> {
        try {
            return await Token.findOne(filter, projection, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default TokenRepository;