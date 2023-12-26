import { AnyKeys, FilterQuery, ObjectId, QueryOptions, UpdateQuery } from 'mongoose';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';

/* Models */
import { Task } from '../models';

/* Interfaces */
import { TaskEndpoint } from '../../modules/tasks';
import { ITask, TaskModel } from '../interfaces';

/* Utils */
import { DatabaseError } from '../utils';

class TaskRepository {
    /**
     * Creates a new TaskModel object with the provided data.
     *
     * @param {AnyKeys<TaskModel>} data - The data to create the TaskModel object.
     * @return {Promise<TaskModel>} A promise that resolves to the created TaskModel object.
     */
    public static async create(data: AnyKeys<TaskModel>): Promise<TaskModel> {
        try {
            return await Task.create(data);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes a single task from the database.
     *
     * @param {FilterQuery<TaskModel>} filter - The filter to apply when deleting the task.
     * @return {Promise<void>} - A promise that resolves when the task is successfully deleted.
     */
    public static async deleteOne(filter?: FilterQuery<TaskModel>): Promise<void> {
        try {
            await Task.deleteOne(filter);
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
            id: task._id,
            userId: task.userId,
            title: task.title,
            description: task.description,
            image: task.image,
            deadline: task.deadline,
            status: task.status,
            createdAt: task.createdAt!,
            updatedAt: task.updatedAt!
        }
    }

    /**
     * Finds a single task in the database based on the provided filter query.
     *
     * @param {FilterQuery<TaskModel>} filter - The filter query used to find the task.
     * @return {Promise<TaskModel | null>} A Promise that resolves to the found task, or null if no task is found.
     */
    public static async findOne(filter: FilterQuery<TaskModel>): Promise<TaskModel | null> {
        try {
            return await Task.findOne(filter);
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
            return await Task.paginate(options);
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
            return await Task.findByIdAndUpdate(id, update, options);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }
}

export default TaskRepository;