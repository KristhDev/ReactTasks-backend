/* Database */
import { DatabaseError, TokenSchema, TokenRepository } from '@database';

/* Mocks */
import { tokenMock, tokenModelMock } from '@mocks';

const createTokenSpy = jest.spyOn(TokenSchema, 'create');
const deleteManyTokenSpy = jest.spyOn(TokenSchema, 'deleteMany');
const deleteOneTokenSpy = jest.spyOn(TokenSchema, 'deleteOne');
const findOneTokenSpy = jest.spyOn(TokenSchema, 'findOne');

describe('Test in TokenRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create token', async () => {
        createTokenSpy.mockResolvedValue(tokenModelMock as any);

        const token = await TokenRepository.create({
            token: tokenModelMock.token,
            expiresIn: tokenModelMock.expiresIn
        });

        expect(token).toEqual(tokenMock);
        expect(createTokenSpy).toHaveBeenCalledTimes(1);
        expect(createTokenSpy).toHaveBeenCalledWith({
            expiresIn: tokenModelMock.expiresIn,
            token: tokenModelMock.token
        });
    });

    it('should throw error in create token', async () => {
        createTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TokenRepository.create({
                expiresIn: tokenModelMock.expiresIn,
                token: tokenModelMock.token
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createTokenSpy).toHaveBeenCalledTimes(1);
            expect(createTokenSpy).toHaveBeenCalledWith({
                expiresIn: tokenModelMock.expiresIn,
                token: tokenModelMock.token
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many tokens', async () => {
        deleteManyTokenSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TokenRepository.deleteMany({ id: tokenModelMock._id });

        expect(deleteManyTokenSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyTokenSpy).toHaveBeenCalledWith({ _id: tokenModelMock._id });
    });

    it('should throw error in delete many tokens', async () => {
        deleteManyTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TokenRepository.deleteMany({ id: tokenModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyTokenSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyTokenSpy).toHaveBeenCalledWith({ _id: tokenModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one token', async () => {
        deleteOneTokenSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TokenRepository.deleteOne({ id: tokenModelMock._id });

        expect(deleteOneTokenSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTokenSpy).toHaveBeenCalledWith({ _id: tokenModelMock._id });
    });

    it('should throw error in delete one token', async () => {
        deleteOneTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TokenRepository.deleteOne({ id: tokenModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneTokenSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneTokenSpy).toHaveBeenCalledWith({ _id: tokenModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one token', async () => {
        findOneTokenSpy.mockResolvedValue(tokenModelMock);

        const token = await TokenRepository.findOne({ id: tokenModelMock._id });

        expect(token).toEqual({ 
            ...tokenMock,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });

        expect(findOneTokenSpy).toHaveBeenCalledTimes(1);
        expect(findOneTokenSpy).toHaveBeenCalledWith({ _id: tokenModelMock._id });
    });

    it('should throw error in find one token', async () => {
        findOneTokenSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TokenRepository.findOne({ id: tokenModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneTokenSpy).toHaveBeenCalledTimes(1);
            expect(findOneTokenSpy).toHaveBeenCalledWith({ _id: tokenModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });
});