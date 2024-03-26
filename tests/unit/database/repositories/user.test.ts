/* Mocks */
import { userHashedPassMock, userHashedPassModelMock } from '@mocks';

/* Database */
import { DatabaseError, UserSchema, UserRepository } from '@database';

const createUserSpy = jest.spyOn(UserSchema, 'create');
const deleteManyUserSpy = jest.spyOn(UserSchema, 'deleteMany');
const deleteOneUserSpy = jest.spyOn(UserSchema, 'deleteOne');
const findUserSpy = jest.spyOn(UserSchema, 'find');
const findByIdUserSpy = jest.spyOn(UserSchema, 'findById');
const findByIdAndUpdateUserSpy = jest.spyOn(UserSchema, 'findByIdAndUpdate');
const findOneUserSpy = jest.spyOn(UserSchema, 'findOne');
const insertManyUserSpy = jest.spyOn(UserSchema, 'insertMany');

describe('Test in UserRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create user', async () => {
        createUserSpy.mockResolvedValue(userHashedPassModelMock as any);

        const user = await UserRepository.create({
            name: userHashedPassModelMock.name,
            lastname: userHashedPassModelMock.lastname,
            email: userHashedPassModelMock.email,
            password: userHashedPassModelMock.password!
        });

        expect(user).toEqual({
            id: userHashedPassModelMock._id.toString(),
            name: userHashedPassModelMock.name,
            lastname: userHashedPassModelMock.lastname,
            email: userHashedPassModelMock.email,
            password: userHashedPassModelMock.password,
            verified: userHashedPassModelMock.verified,
            createdAt: userHashedPassModelMock.createdAt!,
            updatedAt: userHashedPassModelMock.updatedAt!
        });

        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledWith({
            name: userHashedPassModelMock.name,
            lastname: userHashedPassModelMock.lastname,
            email: userHashedPassModelMock.email,
            password: userHashedPassModelMock.password
        });
    });

    it('should throw error in create user', async () => {
        createUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.create({
                name: userHashedPassModelMock.name,
                lastname: userHashedPassModelMock.lastname,
                email: userHashedPassModelMock.email,
                password: userHashedPassModelMock.password!
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createUserSpy).toHaveBeenCalledTimes(1);
            expect(createUserSpy).toHaveBeenCalledWith({
                name: userHashedPassModelMock.name,
                lastname: userHashedPassModelMock.lastname,
                email: userHashedPassModelMock.email,
                password: userHashedPassModelMock.password
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many users', async () => {
        deleteManyUserSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await UserRepository.deleteMany({ id: userHashedPassModelMock.id });

        expect(deleteManyUserSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyUserSpy).toHaveBeenCalledWith({ _id: userHashedPassModelMock._id });
    });

    it('should throw error in delete many users', async () => {
        deleteManyUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.deleteMany({ id: userHashedPassModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyUserSpy).toHaveBeenCalledWith({ _id: userHashedPassModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one user', async () => {
        deleteOneUserSpy.mockResolvedValue({} as any);

        await UserRepository.deleteOne({ id: userHashedPassModelMock._id });

        expect(deleteOneUserSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassModelMock._id });
    });

    it('should throw error in delete one user', async () => {
        deleteOneUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.deleteOne({ id: userHashedPassModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should transform a UserModel object to a UserEndpoint object', () => {
        const userEndpoint = UserRepository.toEndpoint(userHashedPassMock);

        expect(userEndpoint).toEqual({
            id: userHashedPassModelMock._id.toString(),
            name: userHashedPassModelMock.name,
            lastname: userHashedPassModelMock.lastname,
            email: userHashedPassModelMock.email,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });
    });

    it('should find users', async () => {
        findUserSpy.mockResolvedValue([ userHashedPassModelMock ]);

        const users = await UserRepository.find({});

        expect(users).toEqual([
            {
                id: userHashedPassModelMock._id.toString(),
                name: userHashedPassModelMock.name,
                lastname: userHashedPassModelMock.lastname,
                email: userHashedPassModelMock.email,
                verified: userHashedPassModelMock.verified,
                password: userHashedPassModelMock.password,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        ]);

        expect(findUserSpy).toHaveBeenCalledTimes(1);
        expect(findUserSpy).toHaveBeenCalledWith({}, undefined);
    });

    it('should throw error in find users', async () => {
        findUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.find({});
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findUserSpy).toHaveBeenCalledTimes(1);
            expect(findUserSpy).toHaveBeenCalledWith({}, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id user', async () => {
        findByIdUserSpy.mockResolvedValue(userHashedPassModelMock);

        const user = await UserRepository.findById(userHashedPassModelMock._id);

        expect(user).toEqual({ 
            ...userHashedPassMock, 
            createdAt: expect.any(String), 
            updatedAt: expect.any(String) 
        });

        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledWith(userHashedPassModelMock._id);
    });

    it('should throw error in find by id user', async () => {
        findByIdUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findById(userHashedPassModelMock._id);
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
            expect(findByIdUserSpy).toHaveBeenCalledWith(userHashedPassModelMock._id);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id and update user', async () => {
        findByIdAndUpdateUserSpy.mockResolvedValue(userHashedPassModelMock);

        const user = await UserRepository.findByIdAndUpdate(userHashedPassMock.id, { name: userHashedPassModelMock.name });

        expect(user).toEqual({
            ...userHashedPassMock,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userHashedPassMock.id, { name: userHashedPassModelMock.name }, { new: true });
    });

    it('should throw error in find by id and update user', async () => {
        findByIdAndUpdateUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.findByIdAndUpdate(userHashedPassMock.id, { name: userHashedPassModelMock.name });
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
            expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userHashedPassModelMock.id, { name: userHashedPassModelMock.name }, { new: true });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one user', async () => {
        findOneUserSpy.mockResolvedValue(userHashedPassModelMock);

        const user = await UserRepository.findOne({ id: userHashedPassModelMock.id });

        expect(user).toEqual({
            ...userHashedPassMock,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassModelMock._id });
    });

    it('should throw error in find one user', async () => {
        findOneUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.findOne({ id: userHashedPassModelMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneUserSpy).toHaveBeenCalledTimes(1);
            expect(findOneUserSpy).toHaveBeenCalledWith({ _id: userHashedPassModelMock._id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should insert many users', async () => {
        insertManyUserSpy.mockResolvedValue([ userHashedPassModelMock, userHashedPassModelMock ]);

        const users = await UserRepository.insertMany([ 
            { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password! },
            { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password! }
        ]);

        expect(users).toEqual([ 
            { ...userHashedPassMock, createdAt: expect.any(String), updatedAt: expect.any(String) },
            { ...userHashedPassMock, createdAt: expect.any(String), updatedAt: expect.any(String) }
        ]);

        expect(insertManyUserSpy).toHaveBeenCalledTimes(1);
        expect(insertManyUserSpy).toHaveBeenCalledWith([
            { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password },
            { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password }
        ]);
    });

    it('should throw error in insert many users', async () => {
        insertManyUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.insertMany([ 
                { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password! },
                { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password! }
            ]);

            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(insertManyUserSpy).toHaveBeenCalledTimes(1);
            expect(insertManyUserSpy).toHaveBeenCalledWith([
                { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password },
                { name: userHashedPassModelMock.name, lastname: userHashedPassModelMock.lastname, email: userHashedPassModelMock.email, password: userHashedPassModelMock.password }
            ]);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error')
        }
    });
});