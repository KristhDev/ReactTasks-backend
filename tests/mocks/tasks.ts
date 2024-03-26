/* Database */
import { TaskModel } from '@database';

/* Tasks */
import { Task } from '@tasks';

export const taskMock: Task = {
    id: '65cad8ccb2092e00addead85',
    userId: '65cad8ccb2092e00addead85',
    title: 'Task title',
    description: 'Task description',
    deadline: new Date().toISOString(),
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

export const taskModelMock: TaskModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    userId: '65cad8ccb2092e00addead85',
    title: 'Task title',
    description: 'Task description',
    deadline: new Date().toISOString(),
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as TaskModel;