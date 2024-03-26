/* Database */
import { DatabaseError, VerificationSchema, VerificationRepository } from '@database';

/* Mocks */
import { verificationEmailMock, verificationEmailModelMock } from '@mocks';

const createVerificationSpy = jest.spyOn(VerificationSchema, 'create');
const deleteOneVerificationSpy = jest.spyOn(VerificationSchema, 'deleteOne');
const findOneVerificationSpy = jest.spyOn(VerificationSchema, 'findOne');

describe('Test in VerificationRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create verification', async () => {
        createVerificationSpy.mockResolvedValue(verificationEmailModelMock as any);

        const verification = await VerificationRepository.create({
            userId: verificationEmailModelMock.userId,
            token: verificationEmailModelMock.token,
            type: verificationEmailModelMock.type,
            expiresIn: verificationEmailModelMock.expiresIn
        });

        expect(verification).toEqual({
            ...verificationEmailMock,
            expiresIn: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });

        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            userId: verificationEmailModelMock.userId,
            expiresIn: verificationEmailModelMock.expiresIn,
            type: verificationEmailModelMock.type,
            token: verificationEmailModelMock.token
        });
    });

    it('should throw error in create verification', async () => {
        createVerificationSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await VerificationRepository.create({
                userId: verificationEmailModelMock.userId,
                expiresIn: verificationEmailModelMock.expiresIn,
                type: verificationEmailModelMock.type,
                token: verificationEmailModelMock.token
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createVerificationSpy).toHaveBeenCalledTimes(1);
            expect(createVerificationSpy).toHaveBeenCalledWith({
                userId: verificationEmailModelMock.userId,
                expiresIn: verificationEmailModelMock.expiresIn,
                type: verificationEmailModelMock.type,
                token: verificationEmailModelMock.token
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one verification', async () => {
        deleteOneVerificationSpy.mockResolvedValue({} as any);

        await VerificationRepository.deleteOne({ id: verificationEmailModelMock._id });

        expect(deleteOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationEmailModelMock._id });
    });

    it('should throw error in delete one verification', async () => {
        deleteOneVerificationSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await VerificationRepository.deleteOne({ id: verificationEmailModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneVerificationSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationEmailModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one verification', async () => {
        findOneVerificationSpy.mockResolvedValue(verificationEmailModelMock);

        const verification = await VerificationRepository.findOne({ id: verificationEmailModelMock._id });

        expect(verification).toEqual({
            ...verificationEmailMock,
            expiresIn: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });

        expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(findOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationEmailModelMock._id });
    });

    it('should throw error in find one verification', async () => {
        findOneVerificationSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await VerificationRepository.findOne({ id: verificationEmailModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
            expect(findOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationEmailModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });
});