/* Database */
import { BaseRepository, CreateTokenData, DatabaseError, TokenSchema, TokenModel, TokenFilter } from '@database';

/* Auth */
import { Token } from '@auth';

class TokenRepository {
    /**
     * Creates a new token in the database.
     *
     * @param {CreateTokenData} data - The data used to create the token.
     * @return {Promise<Token>} The newly created token.
     */
    public static async create(data: CreateTokenData): Promise<Token> {
        try {
            const token = await TokenSchema.create(data);
            return TokenRepository.toToken(token);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete all expired tokens based on the provided date.
     *
     * @param {Date | string | number} date - The date to compare token expiration against.
     * @return {Promise<void>} Promise that resolves with no value on successful deletion.
     */
    public static async deleteLastExpired(date: Date | string | number): Promise<void> {
        try {
            await TokenSchema.deleteMany({ expiresIn: { $lte: date } });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Asynchronously deletes multiple records from the database that match the given filter query.
     *
     * @param {TokenFilter} filter - The filter query to match records for deletion
     * @return {Promise<void>} A promise that resolves when the deletion is successful
     */
    public static async deleteMany(filter: TokenFilter): Promise<void> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<TokenFilter>(filter);
            await TokenSchema.deleteMany({ ...filterParsed });
        }
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes one token based on the provided filter query.
     *
     * @param {TokenFilter} filter - the filter query for deleting the token
     * @return {Promise<void>} a Promise that resolves with no value upon successful deletion
     */
    public static async deleteOne(filter: TokenFilter): Promise<void> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<TokenFilter>(filter);
            await TokenSchema.deleteOne({ ...filterParsed });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single token based on the provided filter.
     *
     * @param {TokenFilter} filter - The filter used to search for the token.
     * @return {Promise<Token | null>} A promise that resolves to the found token, or null if no token is found.
     */
    public static async findOne(filter: TokenFilter): Promise<Token | null> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<TokenFilter>(filter);
            const token = await TokenSchema.findOne({ ...filterParsed });
            if (!token) return null;

            return TokenRepository.toToken(token);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Converts a TokenModel object to a Token object.
     *
     * @param {TokenModel} token - The TokenModel object to convert.
     * @return {Token} The converted Token object.
     */
    private static toToken(token: TokenModel): Token {
        return {
            id: token._id.toString(),
            expiresIn: token.expiresIn,
            token: token.token,
            createdAt: new Date(token.createdAt!).toISOString(),
            updatedAt: new Date(token.updatedAt!).toISOString()
        }
    }
}

export default TokenRepository;