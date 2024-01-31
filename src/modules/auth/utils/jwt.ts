import jsonwebtoken, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

/* Database */
import { DatabaseError, TokenRepository } from '../../../database';

/* Errors */
import { JWTError } from './errors';

class JWT {
    /**
     * Decodes a JWT token and returns the payload.
     *
     * @param {string} token - The JWT token to be decoded.
     * @return {JwtPayload | undefined} Returns the decoded payload if successful, otherwise undefined.
     */
    public static decodeToken(token: string): JwtPayload | undefined {
        try {
            return jwtDecode(token);
        } 
        catch (error) {
            console.log(error);
            throw new JWTError((error as any).message);
        }
    }

    /**
     * Generates a token using the provided data.
     *
     * @param {any} data - The data to be included in the token.
     * @param {string} expiresIn - The expiration time of the token.
     * @return {string} The generated token.
     */
    public static generateToken(data: any, expiresIn: string = '1d'): string {
        try {
            return jsonwebtoken.sign(
                data,
                process.env.JWT_SECRET!,
                { expiresIn }
            );
        } 
        catch (error) {
            throw new JWTError((error as any).message);
        }
    }

    /**
     * Validates a token and returns the decoded value.
     *
     * @param {string} token - The token to be validated.
     * @return {Promise<T>} The decoded value of the token.
     */
    public static async validateToken<T>(token: string): Promise<T> {
        try {
            const revokedToken = await TokenRepository.findOne({ token });
            if (revokedToken) throw new JWTError('El token ya ha sido revocado.');

            return jsonwebtoken.verify(token, process.env.JWT_SECRET!) as T
        } 
        catch (error) {
            if (error instanceof DatabaseError) throw new DatabaseError(error.message);
            if (error instanceof TokenExpiredError) throw new JWTError('Su tiempo de sesión ha expirado. Por favor, inicie sesión de nuevo.');
            throw new JWTError((error as any).message);
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

            await TokenRepository.create({ token, expiresIn });
        } 
        catch (error) {
            if (error instanceof DatabaseError) throw new DatabaseError(error.message);
            throw new JWTError((error as any).message);
        }
    }
}

export default JWT;