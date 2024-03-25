import { FilterQuery, MongooseQueryOptions, ProjectionType, QueryOptions } from 'mongoose';

/* Database */
import { CreateUserData, DatabaseError, UpdateUserData, UserSchema, UserFilter, UserModel } from '@database';

/* Auth */
import { User, UserEndpoint } from '@auth';

class UserRepository {
    /**
     * Creates a new user in the database.
     *
     * @param {CreateUserData} data - The data for creating the user.
     * @return {Promise<User>} The created user.
     */
    public static async create(data: CreateUserData): Promise<User> {
        try {
            const user = await UserSchema.create(data);
            return UserRepository.toUser(user);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * A function that deletes multiple user records based on the provided filter.
     *
     * @param {UserFilter} filter - the filter to apply when deleting user records
     * @return {Promise<void>} a promise that resolves when the delete operation is complete
     */
    public static async deleteMany(filter: UserFilter): Promise<void> {
        try {
            await UserSchema.deleteMany(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete one record that matches the filter.
     *
     * @param {UserFilter} filter - The filter to apply for deletion
     * @return {Promise<void>} A promise that resolves when the deletion is complete
     */
    public static async deleteOne(filter: UserFilter): Promise<void> {
        try {
            await UserSchema.deleteOne(filter);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Converts a UserType to a UserEndpoint object.
     *
     * @param {User} user - The UserModel object to be converted.
     * @return {UserEndpoint} - The converted UserEndpoint object.
     */
    public static toEndpoint(user: User): UserEndpoint {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            createdAt: new Date(user.createdAt!).toISOString(),
            updatedAt: new Date(user.updatedAt!).toISOString()
        }
    }

    /**
     * Converts a UserModel object to a User object.
     *
     * @param {UserModel} user - The UserModel object to convert.
     * @return {User} The converted User object.
     */
    private static toUser(user: UserModel): User {
        return {
            id: user._id.toString(),
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            verified: user.verified,
            password: user?.password,
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
            return await UserSchema.find(filter, projection, options);
        }
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Find a user by their ID.
     *
     * @param {string} id - The ID of the user.
     * @returns {Promise<User | null>} A promise that resolves to the user object or null if not found.
     */
    public static async findById(id: string): Promise<User | null> {
        try {
            const user = await UserSchema.findById(id);
            if (!user) return null;

            return UserRepository.toUser(user);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a user by ID and updates their information.
     *
     * @param {string} id - The ID of the user to update.
     * @param {UpdateUserData} data - The update object with the new information.
     * @return {Promise<User | null>} A promise that resolves to the updated user object, or null if no user was found.
     */
    public static async findByIdAndUpdate(
        id: string,
        data?: UpdateUserData
    ): Promise<User | null> {
        try {
            const user = await UserSchema.findByIdAndUpdate(id, data, { new: true });
            if (!user) return null;

            return UserRepository.toUser(user);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single user that matches the given filter.
     *
     * @param {UserFilter} filter - The filter to apply when searching for the user.
     * @return {Promise<User | null>} A promise that resolves with the found user or null if no user is found.
     */
    public static async findOne(
        filter: UserFilter
    ): Promise<User | null> {
        try {
            const user = await UserSchema.findOne({ ...filter });
            if (!user) return null;

            return UserRepository.toUser(user);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Asynchronously inserts multiple data into the database.
     *
     * @param {CreateUserData[]} data - The data to be inserted into the database.
     * @return {Promise<MergeType<UserModel, Omit<AnyKeys<UserModel>, '_id'>>[]} The inserted data.
     */
    public static async insertMany(data: CreateUserData[]): Promise<User[]> {
        try {
            const users = await UserSchema.insertMany(data);
            return users.map((user) => UserRepository.toUser(user as any));
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default UserRepository;