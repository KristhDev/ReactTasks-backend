/* Interfaces */
import { TaskModel } from '../../../database';
import { TaskEndpoint } from '../interfaces';

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