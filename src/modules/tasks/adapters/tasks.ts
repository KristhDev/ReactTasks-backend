import { TaskEndpoint, TaskModel } from '../interfaces';

export const taskEndpointAdapter = (task: TaskModel): TaskEndpoint => ({
    id: task._id,
    userId: task.userId,
    title: task.title,
    description: task.description,
    image: task.image,
    deadline: task.deadline!,
    createdAt: task.createdAt!,
    updatedAt: task.updatedAt!
});