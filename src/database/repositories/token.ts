import { AnyKeys, FilterQuery } from 'mongoose';

/* Models */
import { Token } from '../models';

/* Interfaces */
import { TokenModel } from '../interfaces';

/* Utils */
import { DatabaseError } from '../utils';

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
     * Finds a single token based on the provided filter.
     *
     * @param {FilterQuery<TokenModel>} filter - The filter used to search for the token.
     * @return {Promise<TokenModel | null>} A promise that resolves to the found token, or null if no token is found.
     */
    public static async findOne(filter: FilterQuery<TokenModel>): Promise<TokenModel | null> {
        try {
            return await Token.findOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default TokenRepository;