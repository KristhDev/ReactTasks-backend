import mongoose from 'mongoose';

/* Database */
import { Database, DatabaseError } from '@database';

const mongooseConnectSpy = jest.spyOn(mongoose, 'connect').mockImplementation(jest.fn());
const mongooseDisconnectSpy = jest.spyOn(mongoose, 'disconnect').mockImplementation(jest.fn());

const database = new Database();

describe('Test in Database class of database module', () => {
    it('should has methods', () => {
        expect(Database.prototype).toHaveProperty('connect');
        expect(Database.prototype).toHaveProperty('disconnect');
    });

    it('should call connect with the correct parameters', async () => {
        await database.connect();

        expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);
        expect(mongooseConnectSpy).toHaveBeenCalledWith(expect.any(String));
    });

    it('should throw error in connect', async () => {
        mongooseConnectSpy.mockImplementation(() => { throw new Error('Database not found'); });

        try {
            await database.connect();
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);
            expect(mongooseConnectSpy).toHaveBeenCalledWith(expect.any(String));

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database not found');
        }
    });

    it('should call disconnect with the correct parameters', async () => {
        await database.disconnect();

        expect(mongooseDisconnectSpy).toHaveBeenCalledTimes(1);
        expect(mongooseDisconnectSpy).toHaveBeenCalledWith();
    });

    it('should throw error in disconnect', async () => {
        mongooseDisconnectSpy.mockImplementation(() => { throw new Error('Database not found'); });

        try {
            await database.disconnect();
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(mongooseDisconnectSpy).toHaveBeenCalledTimes(1);
            expect(mongooseDisconnectSpy).toHaveBeenCalledWith();

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database not found');
        }
    });
});