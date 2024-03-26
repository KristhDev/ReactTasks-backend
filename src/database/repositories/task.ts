/* Database */
import {
    BaseRepository,
    DatabaseError,
    TaskSchema,
    TaskModel,
    CreateTaskData,
    TaskFilter,
    UpdateTaskData,
    TaskPaginateOptions,
    TasksPaginated, 
} from '@database';

/* Tasks */
import { Task, TaskEndpoint } from '@tasks';

class TaskRepository {
    /**
     * Creates a new Task object with the provided data.
     *
     * @param {CreateTaskData} data - The data to create the Task object.
     * @return {Promise<Task>} A promise that resolves to the created TaskModel object.
     */
    public static async create(data: CreateTaskData): Promise<Task> {
        try {
            const task = await TaskSchema.create({ ...data });
            return TaskRepository.toTask(task);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Delete multiple tasks based on the provided filter.
     *
     * @param {TaskFilter} filter - Optional filter for tasks to delete
     * @return {Promise<void>} Promise that resolves when the deletion is successful
     */
    public static async deleteMany(filter: TaskFilter): Promise<void> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<TaskFilter>(filter);
            await TaskSchema.deleteMany({ ...filterParsed });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Deletes a single task from the database.
     *
     * @param {TaskFilter} filter - The filter to apply when deleting the task.
     * @return {Promise<void>} - A promise that resolves when the task is successfully deleted.
     */
    public static async deleteOne(filter: TaskFilter): Promise<void> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<TaskFilter>(filter);
            await TaskSchema.deleteOne({ ...filterParsed });
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a single task in the database based on the provided filter query.
     *
     * @param {TaskFilter} filter - The filter query used to find the task.
     * @return {Promise<Task | null>} A Promise that resolves to the found task, or null if no task is found.
     */
    public static async findOne(filter: TaskFilter): Promise<Task | null> {
        try {
            const filterParsed = BaseRepository.parseFilterOptions<TaskFilter>(filter);

            const task = await TaskSchema.findOne({ ...filterParsed });
            if (!task) return null;

            return TaskRepository.toTask(task);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Finds a record by its ID and updates it.
     *
     * @param {string} id - The ID of the record to find and update.
     * @param {UpdateTaskData} data - The update to apply to the record.
     * @return {Promise<Task | null>} A promise that resolves to the updated record, or null if not found.
     */
    public static async findByIdAndUpdate(id: string, data?: UpdateTaskData): Promise<Task | null> {
        try {
            const task = await TaskSchema.findByIdAndUpdate(id, data, { new: true });
            if (!task) return null; 

            return TaskRepository.toTask(task);
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * This function inserts multiple data entries into the database.
     *
     * @param {CreateTaskData[]} data - the data entries to be inserted
     * @return {Promise<Task[]>} the inserted data entries
     */
    public static async insertMany(data: CreateTaskData[]): Promise<Task[]> {
        try {
            const tasks = await TaskSchema.insertMany(data);
            return tasks.map((task) => TaskRepository.toTask(task as any));
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
    public static async paginate(options: TaskPaginateOptions): Promise<TasksPaginated> {
        try {
            const result = await TaskSchema.paginate(options);

            return {
                tasks: result?.docs?.map((task) => TaskRepository.toTask(task as any)) || [],
                pagination: {
                    currentPage: result?.page || 0,
                    hasNextPage: Boolean(result?.hasNextPage || false),
                    hasPrevPage: Boolean(result?.hasPrevPage || false),
                    nextPage: result?.nextPage || 0,
                    totalPages: result?.totalPages || 0
                }
            }
        } 
        catch (error) {
            throw new DatabaseError((error as any).message);
        }
    }

    /**
     * Converts a Task to a TaskEndpoint object.
     *
     * @param {TaskModel} task - The TaskModel object to be converted.
     * @return {TaskEndpoint} - The converted TaskEndpoint object.
     */
    public static toEndpoint(task: Task): TaskEndpoint {
        return {
            id: task.id,
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
     * Converts a TaskModel object to a Task object.
     *
     * @param {TaskModel} task - The TaskModel object to convert.
     * @return {Task} The converted Task object.
     */
    private static toTask(task: TaskModel): Task {
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
}

export default TaskRepository;