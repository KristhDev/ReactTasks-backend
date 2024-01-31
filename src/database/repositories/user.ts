import { AnyKeys, FilterQuery, ObjectId, QueryOptions, UpdateQuery } from 'mongoose';

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
            id: user._id.toString(),
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            createdAt: new Date(user.createdAt!).toISOString(),
            updatedAt: new Date(user.updatedAt!).toISOString()
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
     * Finds a user by ID and updates their information.
     *
     * @param {ObjectId | any} id - The ID of the user to update.
     * @param {UpdateQuery<UserModel>} update - The update object with the new information.
     * @param {QueryOptions<UserModel> | null} options - The options for the query, if any.
     * @return {Promise<UserModel | null>} A promise that resolves to the updated user object, or null if no user was found.
     */
    public static async findByIdAndUpdate(
        id?: ObjectId | any,
        update?: UpdateQuery<UserModel>,
        options?: QueryOptions<UserModel> | null
    ): Promise<UserModel | null> {
        try {
            return await User.findByIdAndUpdate(id, update, options);
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