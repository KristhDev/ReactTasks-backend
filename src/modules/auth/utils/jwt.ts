import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

/* Database */
import { Token } from '../../../database';

/* Errors */
import { JWTError } from './errors';

class JWT {
    /**
     * Generates a token using the provided data.
     *
     * @param {any} data - The data to be included in the token.
     * @return {string} The generated token.
     */
    public static generateToken(data: any): string {
        return jsonwebtoken.sign(
            data,
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
    }

    /**
     * Validates a token and returns the decoded value.
     *
     * @param {string} token - The token to be validated.
     * @return {Promise<T>} The decoded value of the token.
     */
    public static async validateToken<T>(token: string): Promise<T> {
        try {
            const revokedToken = await Token.findOne({ token });
            if (revokedToken) throw new JWTError('El token ya ha sido revocado.');

            return jsonwebtoken.verify(token, process.env.JWT_SECRET!) as T
        } 
        catch (error) {
            throw error;
        }
    }

    /**
     * Revokes a token by extracting the expiration date from the token,
     * converting it to an ISO string, and creating a record in the Token table
     * with the token and expiration date.
     *
     * @param {string} token - The token to be revoked.
     * @return {Promise<void>} - A promise that resolves with no value upon completion.
     */
    public static async revokeToken(token: string): Promise<void> {
        try {
            const { exp } = jsonwebtoken.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            const expiresIn = new Date(exp! * 1000).toISOString();

            await Token.create({ token, expiresIn });
        } 
        catch (error) {
            throw error;
        }
    }
}

export default JWT;