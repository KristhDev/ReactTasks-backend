import { AnyKeys, FilterQuery } from 'mongoose';

/* Models */
import { User } from '../models';

/* Interfaces */
import { UserModel } from '../interfaces';
import { UserEndpoint } from '../../modules/auth';

/* Utils */
import { DatabaseError } from '../utils';

class UserRepository {
    /**
     * Creates a new user in the database.
     *
     * @param {AnyKeys<UserModel>} data - The data for creating the user.
     * @return {Promise<UserModel>} The created user.
     */
    public static async create(data: AnyKeys<UserModel>): Promise<UserModel> {
        try {
            return await User.create(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Converts a UserModel to a UserEndpoint object.
     *
     * @param {UserModel} user - The UserModel object to be converted.
     * @return {UserEndpoint} - The converted UserEndpoint object.
     */
    public static endpointAdapter(user: UserModel): UserEndpoint {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!
        }
    }

    /**
     * Find a user by their ID.
     *
     * @param {string} id - The ID of the user.
     * @returns {Promise<UserModel | null>} A promise that resolves to the user object or null if not found.
     */
    public static async findById(id: string): Promise<UserModel | null> {
        try {
            return await User.findById(id);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Updates a user by finding it using the provided id and applying the given data.
     *
     * @param {string} id - The id of the user to be updated.
     * @param {AnyKeys<UserModel>} data - The data to be applied to the user.
     * @return {Promise<UserModel | null>} - A promise that resolves to the updated user object, or null if no user was found.
     */
    public static async findByIdAndUpdate(id: string, data: AnyKeys<UserModel>): Promise<UserModel | null> {
        try {
            return await User.findByIdAndUpdate(id, data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single user that matches the given filter.
     *
     * @param {FilterQuery<UserModel>} filter - The filter to apply when searching for the user.
     * @return {Promise<UserModel | null>} A promise that resolves with the found user or null if no user is found.
     */
    public static async findOne(filter: FilterQuery<UserModel>): Promise<UserModel | null> {
        try {
            return await User.findOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default UserRepository;