/* Database */
import { DatabaseError, Token, TokenModel, TokenRepository } from '@database';

const tokenMock: TokenModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    token: 'token',
    expiresIn: new Date().toISOString()
} as TokenModel;

const createTokenSpy = jest.spyOn(Token, 'create');
const deleteManyTokenSpy = jest.spyOn(Token, 'deleteMany');
const deleteOneTokenSpy = jest.spyOn(Token, 'deleteOne');
const findOneTokenSpy = jest.spyOn(Token, 'findOne');

describe('Test in TokenRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create token', async () => {
        createTokenSpy.mockResolvedValue(tokenMock as any);

        const token = await TokenRepository.create({
            token: tokenMock.token,
            expiresIn: tokenMock.expiresIn
        });

        expect(token).toEqual(tokenMock);
        expect(createTokenSpy).toHaveBeenCalledTimes(1);
        expect(createTokenSpy).toHaveBeenCalledWith({
            expiresIn: tokenMock.expiresIn,
            token: tokenMock.token
        });
    });

    it('should throw error in create token', async () => {
        createTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const token = await TokenRepository.create({
                expiresIn: tokenMock.expiresIn,
                token: tokenMock.token
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createTokenSpy).toHaveBeenCalledTimes(1);
            expect(createTokenSpy).toHaveBeenCalledWith({
                expiresIn: tokenMock.expiresIn,
                token: tokenMock.token
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many tokens', async () => {
        deleteManyTokenSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TokenRepository.deleteMany({ _id: tokenMock._id });

        expect(deleteManyTokenSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyTokenSpy).toHaveBeenCalledWith({ _id: tokenMock._id }, undefined);
    });

    it('should throw error in delete many tokens', async () => {
        deleteManyTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TokenRepository.deleteMany({ _id: tokenMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyTokenSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyTokenSpy).toHaveBeenCalledWith({ _id: tokenMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one token', async () => {
        deleteOneTokenSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TokenRepository.deleteOne({ _id: tokenMock._id });

        expect(deleteOneTokenSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTokenSpy).toHaveBeenCalledWith({ _id: tokenMock._id }, undefined);
    });

    it('should throw error in delete one token', async () => {
        deleteOneTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TokenRepository.deleteOne({ _id: tokenMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneTokenSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneTokenSpy).toHaveBeenCalledWith({ _id: tokenMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one token', async () => {
        findOneTokenSpy.mockResolvedValue(tokenMock);

        const token = await TokenRepository.findOne({ _id: tokenMock._id });

        expect(token).toEqual(tokenMock);
        expect(findOneTokenSpy).toHaveBeenCalledTimes(1);
        expect(findOneTokenSpy).toHaveBeenCalledWith({ _id: tokenMock._id }, undefined, undefined);
    });

    it('should throw error in find one token', async () => {
        findOneTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const token = await TokenRepository.findOne({ _id: tokenMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneTokenSpy).toHaveBeenCalledTimes(1);
            expect(findOneTokenSpy).toHaveBeenCalledWith({ _id: tokenMock._id }, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });
});