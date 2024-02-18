import { AnyKeys, FilterQuery, MergeType, ObjectId, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

/* Database */
import { DatabaseError, User, UserModel } from '@database';

/* Auth */
import { UserEndpoint } from '@auth';

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
     * A function that deletes multiple user records based on the provided filter and options.
     *
     * @param {FilterQuery<UserModel>} filter - the filter to apply when deleting user records
     * @param {QueryOptions<UserModel>} [options] - optional query options for the delete operation
     * @return {Promise<void>} a promise that resolves when the delete operation is complete
     */
    public static async deleteMany(filter: FilterQuery<UserModel>, options?: QueryOptions<UserModel>): Promise<void> {
        try {
            await User.deleteMany(filter, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete one document that matches the filter.
     *
     * @param {FilterQuery<UserModel>} filter - The filter to apply for deletion
     * @param {QueryOptions<UserModel>} [options] - The options to apply when deleting
     * @return {Promise<void>} A promise that resolves when the deletion is complete
     */
    public static async deleteOne(filter: FilterQuery<UserModel>, options?: QueryOptions<UserModel>): Promise<void> {
        try {
            await User.deleteOne(filter, options);
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
     * Find users based on the provided filter, projection, and options.
     *
     * @param {FilterQuery<UserModel>} filter - The filter to apply when searching for users.
     * @param {ProjectionType<UserModel>} [projection] - The fields to include or exclude in the result.
     * @param {QueryOptions<UserModel>} [options] - The options to apply when querying the database.
     * @return {Promise<UserModel[]>} A promise that resolves with an array of user objects.
     */
    public static async find(
        filter: FilterQuery<UserModel>,
        projection?: ProjectionType<UserModel>,
        options?: QueryOptions<UserModel>
    ): Promise<UserModel[]> {
        try {
            return await User.find(filter, projection, options);
        }
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Find a user by their ID.
     *
     * @param {string} id - The ID of the user.
     * @param {ProjectionType<UserModel> | null} projection - The fields to include or exclude in the result.
     * @param {QueryOptions<UserModel> | null} options - The options to apply when querying the database.
     * @returns {Promise<UserModel | null>} A promise that resolves to the user object or null if not found.
     */
    public static async findById(
        id: string,
        projection?: ProjectionType<UserModel>,
        options?: QueryOptions<UserModel>
    ): Promise<UserModel | null> {
        try {
            return await User.findById(id, projection, options);
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
     * @param {ProjectionType<UserModel> | null} projection - The fields to include or exclude in the result.
     * @param {QueryOptions<UserModel> | null} options - The options to apply when querying the database.
     * @return {Promise<UserModel | null>} A promise that resolves with the found user or null if no user is found.
     */
    public static async findOne(
        filter: FilterQuery<UserModel>,
        projection?: ProjectionType<UserModel>,
        options?: QueryOptions<UserModel>
    ): Promise<UserModel | null> {
        try {
            return await User.findOne(filter, projection, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Asynchronously inserts multiple data into the database.
     *
     * @param {AnyKeys<UserModel>[]} data - The data to be inserted into the database.
     * @return {Promise<MergeType<UserModel, Omit<AnyKeys<UserModel>, '_id'>>[]} The inserted data.
     */
    public static async insertMany(data: AnyKeys<UserModel>[]): Promise<MergeType<UserModel, Omit<AnyKeys<UserModel>, '_id'>>[]> {
        try {
            return await User.insertMany(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default UserRepository;