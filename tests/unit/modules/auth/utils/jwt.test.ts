import jwt from 'jsonwebtoken';

/* Database */
import { Database, TokenRepository } from '@database';

/* Auth */
import { JWT, JWTError, JWTErrorMessages } from '@auth';

const database = new Database();

describe('Test in util JWT of auth module', () => {
    beforeAll(async () => {
        await database.connect();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    it('should decode token and return the payload', () => {
        const token = JWT.generateToken({ data: 'test' });
        const decoded = JWT.decodeToken<{ data: string }>(token);

        expect(decoded?.data).toBe('test');
    });

    it('should faild decode token and throw an error', () => {
        const token = 'invalid-token';

        try {
            const data = JWT.decodeToken(token);
            expect(data).toBeFalsy();
        } 
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
        }
    });

    it('should generate a token using the provided data', () => {
        const token = JWT.generateToken({ data: 'test' });
        expect(token.length).toBeGreaterThan(0);
    });

    it('should faild generate a token and throw an error', () => {
        const signSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error('invalid-data'); });

        try {
            const token = JWT.generateToken('invalid-data');
            expect(token.length).toBeGreaterThan(0);
        } 
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
        }

        signSpy.mockRestore();
    });

    it('should validate a token and return the decoded value', async () => {
        await TokenRepository.deleteMany({});

        const token = JWT.generateToken({ data: 'test' });
        const decoded = await JWT.validateToken<{ data: string }>(token);

        expect(decoded.data).toBe('test');

        await TokenRepository.deleteMany({});
    });

    it('should faild validate a token because it has invalid', async () => {
        await TokenRepository.deleteMany({});
        const token = 'invalid-token';

        try {
            const data = await JWT.validateToken<{ data: string }>(token);
            expect(data).toBeFalsy();
        } 
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
        }
    });

    it('should faild validate a token because it has been revoked', async () => {
        await TokenRepository.deleteMany({});

        const token = JWT.generateToken({ data: 'test' });
        await JWT.revokeToken(token);

        try {
            const data = await JWT.validateToken<{ data: string }>(token);
            expect(data).toBeFalsy();
        }
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
            expect((error as JWTError).message).toBe(JWTErrorMessages.REVOKED);
        }
        finally {
            await TokenRepository.deleteMany({});
        }
    });

    it('should faild validate a token because it has expired', async () => {
        await TokenRepository.deleteMany({});

        const token = JWT.generateToken({ data: 'test' }, '1s');
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const data = await JWT.validateToken<{ data: string }>(token);
            expect(data).toBeFalsy();
        }
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
            expect((error as JWTError).message).toBe(JWTErrorMessages.EXPIRED);
        }
        finally {
            await TokenRepository.deleteMany({});
        }
    });

    it('should revoke a token', async () => {
        await TokenRepository.deleteMany({});

        const token = JWT.generateToken({ data: 'test' });
        await JWT.revokeToken(token);

        const revokedToken = await TokenRepository.findOne({ token });
        expect(revokedToken).toBeTruthy();
        expect(revokedToken?.token).toBe(token);

        await TokenRepository.deleteMany({});
    });

    it('should faild revoke a token because token is invalid', async () => {
        await TokenRepository.deleteMany({});

        const token = 'invalid-token';

        try {
            await JWT.revokeToken(token);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
        }
        finally {
            await TokenRepository.deleteMany({});
        }
    });

    it('should faild revoke a token because token is expired', async () => {
        await TokenRepository.deleteMany({});

        const token = JWT.generateToken({ data: 'test' }, '1s');
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await JWT.revokeToken(token);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error).toBeInstanceOf(JWTError);
            expect((error as JWTError).message).toBe(JWTErrorMessages.EXPIRED);
        }
        finally {
            await TokenRepository.deleteMany({});
        }
    });
});