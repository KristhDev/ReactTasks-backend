/* Mocks */
import { userHashedPassMock } from '@mocks';

/* Database */
import { DatabaseError, User, UserRepository } from '@database';

const createUserSpy = jest.spyOn(User, 'create');
const deleteManyUserSpy = jest.spyOn(User, 'deleteMany');
const deleteOneUserSpy = jest.spyOn(User, 'deleteOne');
const findUserSpy = jest.spyOn(User, 'find');
const findByIdUserSpy = jest.spyOn(User, 'findById');
const findByIdAndUpdateUserSpy = jest.spyOn(User, 'findByIdAndUpdate');
const findOneUserSpy = jest.spyOn(User, 'findOne');
const insertManyUserSpy = jest.spyOn(User, 'insertMany');

describe('Test in UserRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create user', async () => {
        createUserSpy.mockResolvedValue(userHashedPassMock as any);

        const user = await UserRepository.create({
            name: userHashedPassMock.name,
            lastname: userHashedPassMock.lastname,
            email: userHashedPassMock.email,
            password: userHashedPassMock.password
        });

        expect(user).toEqual(userHashedPassMock);

        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledWith({
            name: userHashedPassMock.name,
            lastname: userHashedPassMock.lastname,
            email: userHashedPassMock.email,
            password: userHashedPassMock.password
        });
    });

    it('should throw error in create user', async () => {
        createUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.create({
                name: userHashedPassMock.name,
                lastname: userHashedPassMock.lastname,
                email: userHashedPassMock.email,
                password: userHashedPassMock.password
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createUserSpy).toHaveBeenCalledTimes(1);
            expect(createUserSpy).toHaveBeenCalledWith({
                name: userHashedPassMock.name,
                lastname: userHashedPassMock.lastname,
                email: userHashedPassMock.email,
                password: userHashedPassMock.password
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many users', async () => {
        deleteManyUserSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await UserRepository.deleteMany({ _id: userHashedPassMock._id });

        expect(deleteManyUserSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyUserSpy).toHaveBeenCalledWith({ _id: userHashedPassMock._id }, undefined);
    });

    it('should throw error in delete many users', async () => {
        deleteManyUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.deleteMany({ _id: userHashedPassMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyUserSpy).toHaveBeenCalledWith({ _id: userHashedPassMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one user', async () => {
        deleteOneUserSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await UserRepository.deleteOne({ _id: userHashedPassMock._id });

        expect(deleteOneUserSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassMock._id }, undefined);
    });

    it('should throw error in delete one user', async () => {
        deleteOneUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.deleteOne({ _id: userHashedPassMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should transform a UserModel object to a UserEndpoint object', () => {
        const userEndpoint = UserRepository.endpointAdapter(userHashedPassMock);

        expect(userEndpoint).toEqual({
            id: userHashedPassMock._id.toString(),
            name: userHashedPassMock.name,
            lastname: userHashedPassMock.lastname,
            email: userHashedPassMock.email,
            createdAt: userHashedPassMock.createdAt!,
            updatedAt: userHashedPassMock.updatedAt!
        });
    });

    it('should find users', async () => {
        findUserSpy.mockResolvedValue([ userHashedPassMock ]);

        const users = await UserRepository.find({});

        expect(users).toEqual([ userHashedPassMock ]);

        expect(findUserSpy).toHaveBeenCalledTimes(1);
        expect(findUserSpy).toHaveBeenCalledWith({}, undefined, undefined);
    });

    it('should throw error in find users', async () => {
        findUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const users = await UserRepository.find({});
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findUserSpy).toHaveBeenCalledTimes(1);
            expect(findUserSpy).toHaveBeenCalledWith({}, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id user', async () => {
        findByIdUserSpy.mockResolvedValue(userHashedPassMock);

        const user = await UserRepository.findById(userHashedPassMock._id);

        expect(user).toEqual(userHashedPassMock);
        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledWith(userHashedPassMock._id, undefined, undefined);
    });

    it('should throw error in find by id user', async () => {
        findByIdUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findById(userHashedPassMock._id);
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
            expect(findByIdUserSpy).toHaveBeenCalledWith(userHashedPassMock._id, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id and update user', async () => {
        findByIdAndUpdateUserSpy.mockResolvedValue(userHashedPassMock);

        const user = await UserRepository.findByIdAndUpdate(userHashedPassMock._id, { name: userHashedPassMock.name }, { new: true });

        expect(user).toEqual(userHashedPassMock);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userHashedPassMock._id, { name: userHashedPassMock.name }, { new: true });
    });

    it('should throw error in find by id and update user', async () => {
        findByIdAndUpdateUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findByIdAndUpdate(userHashedPassMock._id, { name: userHashedPassMock.name }, { new: true });
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
            expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userHashedPassMock._id, { name: userHashedPassMock.name }, { new: true });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one user', async () => {
        findOneUserSpy.mockResolvedValue(userHashedPassMock);

        const user = await UserRepository.findOne({ _id: userHashedPassMock._id });

        expect(user).toEqual(userHashedPassMock);
        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassMock._id }, undefined, undefined);
    });

    it('should throw error in find one user', async () => {
        findOneUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findOne({ _id: userHashedPassMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneUserSpy).toHaveBeenCalledTimes(1);
            expect(findOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassMock._id }, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should insert many users', async () => {
        insertManyUserSpy.mockResolvedValue([ userHashedPassMock, userHashedPassMock ]);

        const users = await UserRepository.insertMany([ 
            { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password },
            { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password }
        ]);

        expect(users).toEqual([ userHashedPassMock, userHashedPassMock ]);
        expect(insertManyUserSpy).toHaveBeenCalledTimes(1);
        expect(insertManyUserSpy).toHaveBeenCalledWith([
            { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password },
            { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password }
        ]);
    });

    it('should throw error in insert many users', async () => {
        insertManyUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const users = await UserRepository.insertMany([ 
                { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password },
                { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password }
            ]);

            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(insertManyUserSpy).toHaveBeenCalledTimes(1);
            expect(insertManyUserSpy).toHaveBeenCalledWith([
                { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password },
                { name: userHashedPassMock.name, lastname: userHashedPassMock.lastname, email: userHashedPassMock.email, password: userHashedPassMock.password }
            ]);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error')
        }
    });
});