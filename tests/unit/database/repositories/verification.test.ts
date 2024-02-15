/* Database */
import { DatabaseError, Verification, VerificationModel, VerificationRepository } from '@database';

const verificationMock: VerificationModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    token: 'token',
    type: 'email',
    expiresIn: new Date().toISOString()
} as VerificationModel;

const createVerificationSpy = jest.spyOn(Verification, 'create');
const deleteOneVerificationSpy = jest.spyOn(Verification, 'deleteOne');
const findOneVerificationSpy = jest.spyOn(Verification, 'findOne');

describe('Test in VerificationRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create verification', async () => {
        createVerificationSpy.mockResolvedValue(verificationMock as any);

        const verification = await VerificationRepository.create({
            token: verificationMock.token,
            type: verificationMock.type,
            expiresIn: verificationMock.expiresIn
        });

        expect(verification).toEqual(verificationMock);
        expect(createVerificationSpy).toHaveBeenCalledTimes(1);
        expect(createVerificationSpy).toHaveBeenCalledWith({
            expiresIn: verificationMock.expiresIn,
            type: verificationMock.type,
            token: verificationMock.token
        });
    });

    it('should throw error in create verification', async () => {
        createVerificationSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const verification = await VerificationRepository.create({
                expiresIn: verificationMock.expiresIn,
                type: verificationMock.type,
                token: verificationMock.token
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createVerificationSpy).toHaveBeenCalledTimes(1);
            expect(createVerificationSpy).toHaveBeenCalledWith({
                expiresIn: verificationMock.expiresIn,
                type: verificationMock.type,
                token: verificationMock.token
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one verification', async () => {
        deleteOneVerificationSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await VerificationRepository.deleteOne({ _id: verificationMock._id });

        expect(deleteOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationMock._id }, undefined);
    });

    it('should throw error in delete one verification', async () => {
        deleteOneVerificationSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await VerificationRepository.deleteOne({ _id: verificationMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneVerificationSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one verification', async () => {
        findOneVerificationSpy.mockResolvedValue(verificationMock);

        const verification = await VerificationRepository.findOne({ _id: verificationMock._id });

        expect(verification).toEqual(verificationMock);
        expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(findOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationMock._id }, undefined, undefined);
    });

    it('should throw error in find one verification', async () => {
        findOneVerificationSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const verification = await VerificationRepository.findOne({ _id: verificationMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
            expect(findOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationMock._id }, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });
});