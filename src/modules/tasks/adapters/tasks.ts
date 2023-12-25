/* Interfaces */
import { TaskModel } from '../../../database';
import { TaskEndpoint } from '../interfaces';

/**
 * This function takes a task object and converts it into a TaskEndpoint object.
 *
 * @param {TaskModel} task - The task object to be converted.
 * @return {TaskEndpoint} The converted TaskEndpoint object.
 */
export const taskEndpointAdapter = (task: TaskModel): TaskEndpoint => ({
    id: task._id,
    userId: task.userId,
    title: task.title,
    description: task.description,
    image: task.image,
    deadline: task.deadline,
    status: task.status,
    createdAt: task.createdAt!,
    updatedAt: task.updatedAt!
});