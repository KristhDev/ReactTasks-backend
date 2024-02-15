/* Database */
import { DatabaseError, User, UserModel, UserRepository } from '@database';

/* Auth */
import { Encrypt } from '@auth';

const userMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: Encrypt.createHash('tutuyoyo9102'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

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
        createUserSpy.mockResolvedValue(userMock as any);

        const user = await UserRepository.create({
            name: userMock.name,
            lastname: userMock.lastname,
            email: userMock.email,
            password: userMock.password
        });

        expect(user).toEqual(userMock);

        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledWith({
            name: userMock.name,
            lastname: userMock.lastname,
            email: userMock.email,
            password: userMock.password
        });
    });

    it('should throw error in create user', async () => {
        createUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.create({
                name: userMock.name,
                lastname: userMock.lastname,
                email: userMock.email,
                password: userMock.password
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createUserSpy).toHaveBeenCalledTimes(1);
            expect(createUserSpy).toHaveBeenCalledWith({
                name: userMock.name,
                lastname: userMock.lastname,
                email: userMock.email,
                password: userMock.password
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many users', async () => {
        deleteManyUserSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await UserRepository.deleteMany({ _id: userMock._id });

        expect(deleteManyUserSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyUserSpy).toHaveBeenCalledWith({ _id: userMock._id }, undefined);
    });

    it('should throw error in delete many users', async () => {
        deleteManyUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.deleteMany({ _id: userMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyUserSpy).toHaveBeenCalledWith({ _id: userMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one user', async () => {
        deleteOneUserSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await UserRepository.deleteOne({ _id: userMock._id });

        expect(deleteOneUserSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneUserSpy).toHaveBeenCalledWith({ _id: userMock._id }, undefined);
    });

    it('should throw error in delete one user', async () => {
        deleteOneUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await UserRepository.deleteOne({ _id: userMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneUserSpy).toHaveBeenCalledWith({ _id: userMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should transform a UserModel object to a UserEndpoint object', () => {
        const userEndpoint = UserRepository.endpointAdapter(userMock);

        expect(userEndpoint).toEqual({
            id: userMock._id.toString(),
            name: userMock.name,
            lastname: userMock.lastname,
            email: userMock.email,
            createdAt: userMock.createdAt!,
            updatedAt: userMock.updatedAt!
        });
    });

    it('should find users', async () => {
        findUserSpy.mockResolvedValue([ userMock ]);

        const users = await UserRepository.find({});

        expect(users).toEqual([ userMock ]);

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
        findByIdUserSpy.mockResolvedValue(userMock);

        const user = await UserRepository.findById(userMock._id);

        expect(user).toEqual(userMock);
        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledWith(userMock._id, undefined, undefined);
    });

    it('should throw error in find by id user', async () => {
        findByIdUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findById(userMock._id);
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
            expect(findByIdUserSpy).toHaveBeenCalledWith(userMock._id, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id and update user', async () => {
        findByIdAndUpdateUserSpy.mockResolvedValue(userMock);

        const user = await UserRepository.findByIdAndUpdate(userMock._id, { name: userMock.name }, { new: true });

        expect(user).toEqual(userMock);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userMock._id, { name: userMock.name }, { new: true });
    });

    it('should throw error in find by id and update user', async () => {
        findByIdAndUpdateUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findByIdAndUpdate(userMock._id, { name: userMock.name }, { new: true });
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
            expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userMock._id, { name: userMock.name }, { new: true });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find one user', async () => {
        findOneUserSpy.mockResolvedValue(userMock);

        const user = await UserRepository.findOne({ _id: userMock._id });

        expect(user).toEqual(userMock);
        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ _id: userMock._id }, undefined, undefined);
    });

    it('should throw error in find one user', async () => {
        findOneUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const user = await UserRepository.findOne({ _id: userMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneUserSpy).toHaveBeenCalledTimes(1);
            expect(findOneUserSpy).toHaveBeenCalledWith({ _id: userMock._id }, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should insert many users', async () => {
        insertManyUserSpy.mockResolvedValue([ userMock, userMock ]);

        const users = await UserRepository.insertMany([ 
            { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password },
            { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password }
        ]);

        expect(users).toEqual([ userMock, userMock ]);
        expect(insertManyUserSpy).toHaveBeenCalledTimes(1);
        expect(insertManyUserSpy).toHaveBeenCalledWith([
            { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password },
            { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password }
        ]);
    });

    it('should throw error in insert many users', async () => {
        insertManyUserSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const users = await UserRepository.insertMany([ 
                { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password },
                { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password }
            ]);

            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(insertManyUserSpy).toHaveBeenCalledTimes(1);
            expect(insertManyUserSpy).toHaveBeenCalledWith([
                { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password },
                { name: userMock.name, lastname: userMock.lastname, email: userMock.email, password: userMock.password }
            ]);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error')
        }
    });
});