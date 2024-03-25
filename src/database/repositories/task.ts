import { AnyKeys, FilterQuery, MergeType, MongooseQueryOptions, ObjectId, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';

/* Database */
import { DatabaseError, TaskSchema, ITask, TaskModel } from '@database';

/* Tasks */
import { TaskEndpoint } from '@tasks';

class TaskRepository {
    /**
     * Creates a new TaskModel object with the provided data.
     *
     * @param {AnyKeys<TaskModel>} data - The data to create the TaskModel object.
     * @return {Promise<TaskModel>} A promise that resolves to the created TaskModel object.
     */
    public static async create(data: AnyKeys<TaskModel>): Promise<TaskModel> {
        try {
            return await TaskSchema.create(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete multiple tasks based on the provided filter.
     *
     * @param {FilterQuery<TaskModel>} filter - Optional filter for tasks to delete
     * @param {Omit<MongooseQueryOptions<TaskModel>, 'lean' | 'timestamps'>} [options] - Optional query options
     * @return {Promise<void>} Promise that resolves when the deletion is successful
     */
    public static async deleteMany(filter?: FilterQuery<TaskModel>, options?: Omit<MongooseQueryOptions<TaskModel>, 'lean' | 'timestamps'>): Promise<void> {
        try {
            await TaskSchema.deleteMany(filter, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes a single task from the database.
     *
     * @param {FilterQuery<TaskModel>} filter - The filter to apply when deleting the task.
     * @param {Omit<MongooseQueryOptions<TaskModel>, 'lean' | 'timestamps'>} [options] - Optional query options.
     * @return {Promise<void>} - A promise that resolves when the task is successfully deleted.
     */
    public static async deleteOne(filter?: FilterQuery<TaskModel>, options?: Omit<MongooseQueryOptions<TaskModel>, 'lean' | 'timestamps'>): Promise<void> {
        try {
            await TaskSchema.deleteOne(filter, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Converts a TaskModel object to a TaskEndpoint object.
     *
     * @param {TaskModel} task - The TaskModel object to be converted.
     * @return {TaskEndpoint} - The converted TaskEndpoint object.
     */
    public static endpointAdapter(task: TaskModel): TaskEndpoint {
        return {
            id: task._id.toString(),
            userId: task.userId.toString(),
            title: task.title,
            description: task.description,
            image: task?.image,
            deadline: new Date(task.deadline).toISOString(),
            status: task.status,
            createdAt: new Date(task.createdAt!).toISOString(),
            updatedAt: new Date(task.updatedAt!).toISOString()
        }
    }

    /**
     * Finds a single task in the database based on the provided filter query.
     *
     * @param {FilterQuery<TaskModel>} filter - The filter query used to find the task.
     * @param {ProjectionType<TaskModel>} projection - The projection to apply to the found task.
     * @param {QueryOptions<TaskModel>} options - The options to apply to the query.
     * @return {Promise<TaskModel | null>} A Promise that resolves to the found task, or null if no task is found.
     */
    public static async findOne(
        filter: FilterQuery<TaskModel>,
        projection?: ProjectionType<TaskModel>,
        options?: QueryOptions<TaskModel>
    ): Promise<TaskModel | null> {
        try {
            return await TaskSchema.findOne(filter, projection, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a document by its ID and updates it.
     *
     * @param {ObjectId | any} id - The ID of the document to find and update.
     * @param {UpdateQuery<TaskModel>} update - The update to apply to the document.
     * @param {QueryOptions<TaskModel> | null} options - Additional options for the query.
     * @return {Promise<TaskModel | null>} A promise that resolves to the updated document, or null if not found.
     */
    public static async findByIdAndUpdate(
        id?: ObjectId | any,
        update?: UpdateQuery<TaskModel>, 
        options?: QueryOptions<TaskModel> | null
    ): Promise<TaskModel | null> {
        try {
            return await TaskSchema.findByIdAndUpdate(id, update, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * This function inserts multiple data entries into the database.
     *
     * @param {AnyKeys<TaskModel>[]} data - the data entries to be inserted
     * @return {Promise<MergeType<TaskModel, Omit<AnyKeys<TaskModel>, '_id'>>[]} the inserted data entries
     */
    public static async insertMany(data: AnyKeys<TaskModel>[]): Promise<MergeType<TaskModel, Omit<AnyKeys<TaskModel>, '_id'>>[]> {
        try {
            return await TaskSchema.insertMany(data);
        }
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Retrieves a paginated list of tasks from the database.
     *
     * @param {PaginationOptions} options - The options for pagination.
     * @return {Promise<PaginationModel<ITask> | undefined>} - The paginated list of tasks.
     */
    public static async paginate(options: PaginationOptions): Promise<PaginationModel<ITask> | undefined> {
        try {
            return await TaskSchema.paginate(options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default TaskRepository;