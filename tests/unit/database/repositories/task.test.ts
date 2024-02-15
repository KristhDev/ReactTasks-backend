/* Database */
import { DatabaseError, Task, TaskModel, TaskRepository } from '@database';

const taskMock: TaskModel = {
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

const createTaskSpy = jest.spyOn(Task, 'create');
const deleteManyTaskSpy = jest.spyOn(Task, 'deleteMany');
const deleteOneTaskSpy = jest.spyOn(Task, 'deleteOne');
const findOneTaskSpy = jest.spyOn(Task, 'findOne');
const findByIdAndUpdateTaskSpy = jest.spyOn(Task, 'findByIdAndUpdate');
const insertManyTaskSpy = jest.spyOn(Task, 'insertMany');
const paginateTaskSpy = jest.spyOn(Task, 'paginate');

describe('Test in TaskRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create task', async () => {
        createTaskSpy.mockResolvedValue(taskMock as any);

        const task = await TaskRepository.create({
            userId: taskMock.userId,
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline
        });

        expect(task).toEqual(taskMock);
        expect(createTaskSpy).toHaveBeenCalledTimes(1);
        expect(createTaskSpy).toHaveBeenCalledWith({
            userId: taskMock.userId,
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline
        });
    });

    it('should throw error in create task', async () => {
        createTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const task = await TaskRepository.create({
                userId: taskMock.userId,
                title: taskMock.title,
                description: taskMock.description,
                deadline: taskMock.deadline
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createTaskSpy).toHaveBeenCalledTimes(1);
            expect(createTaskSpy).toHaveBeenCalledWith({
                userId: taskMock.userId,
                title: taskMock.title,
                description: taskMock.description,
                deadline: taskMock.deadline
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many tasks', async () => {
        deleteManyTaskSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TaskRepository.deleteMany({ _id: taskMock._id });

        expect(deleteManyTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id }, undefined);
    });

    it('should throw error in delete many tasks', async () => {
        deleteManyTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.deleteMany({ _id: taskMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyTaskSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one task', async () => {
        deleteOneTaskSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TaskRepository.deleteOne({ _id: taskMock._id });

        expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id }, undefined);
    });

    it('should throw error in delete one task', async () => {
        deleteOneTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.deleteOne({ _id: taskMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id }, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should transform a TaskModel object to a TaskEndpoint object', () => {
        const taskEndpoint = TaskRepository.endpointAdapter(taskMock);

        expect(taskEndpoint).toEqual({
            id: taskMock._id.toString(),
            userId: taskMock.userId.toString(),
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
            status: taskMock.status,
            createdAt: taskMock.createdAt,
            updatedAt: taskMock.updatedAt
        });
    });

    it('should find one task', async () => {
        findOneTaskSpy.mockResolvedValue(taskMock);

        const task = await TaskRepository.findOne({ _id: taskMock._id });

        expect(task).toEqual(taskMock);
        expect(findOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(findOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id }, undefined, undefined);
    });

    it('should throw error in find one task', async () => {
        findOneTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const task = await TaskRepository.findOne({ _id: taskMock._id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneTaskSpy).toHaveBeenCalledTimes(1);
            expect(findOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock._id }, undefined, undefined);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id and update task', async () => {
        findByIdAndUpdateTaskSpy.mockResolvedValue(taskMock);

        const task = await TaskRepository.findByIdAndUpdate(taskMock._id, { title: taskMock.title }, { new: true });

        expect(task).toEqual(taskMock);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { title: taskMock.title }, { new: true });
    });

    it('should throw error in find by id and update task', async () => {
        findByIdAndUpdateTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            const task = await TaskRepository.findByIdAndUpdate(taskMock._id, { title: taskMock.title }, { new: true });
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
            expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock._id, { title: taskMock.title }, { new: true });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should insert many tasks', async () => {
        insertManyTaskSpy.mockResolvedValue([ taskMock, taskMock ]);

        const tasks = await TaskRepository.insertMany([ 
            { userId: taskMock.userId, title: taskMock.title, description: taskMock.description, deadline: taskMock.deadline },
            { userId: taskMock.userId, title: taskMock.title, description: taskMock.description, deadline: taskMock.deadline }
        ]);

        expect(tasks).toEqual([ taskMock, taskMock ]);
        expect(insertManyTaskSpy).toHaveBeenCalledTimes(1);
        expect(insertManyTaskSpy).toHaveBeenCalledWith([
            { userId: taskMock.userId, title: taskMock.title, description: taskMock.description, deadline: taskMock.deadline },
            { userId: taskMock.userId, title: taskMock.title, description: taskMock.description, deadline: taskMock.deadline }
        ]);
    });

    it('should paginate tasks', async () => {
        paginateTaskSpy.mockResolvedValue({
            docs: [ taskMock ],
            totalDocs: 1,
            limit: 10,
            page: 1,
            hasNextPage: false, 
            hasPrevPage: false, 
            nextPage: 1, 
            prevPage: 1, 
            totalPages: 1, 
            pagingCounter: 1 
        } as any);

        const result = await TaskRepository.paginate({ limit: 10, page: 1 });

        expect(result).toEqual({
            docs: result?.docs,
            totalDocs: result?.totalDocs,
            limit: result?.limit,
            page: result?.page,
            hasNextPage: result?.hasNextPage,
            hasPrevPage: result?.hasPrevPage,
            nextPage: result?.nextPage,
            prevPage: result?.prevPage,
            totalPages: result?.totalPages,
            pagingCounter: result?.pagingCounter
        });

        expect(paginateTaskSpy).toHaveBeenCalledTimes(1);
        expect(paginateTaskSpy).toHaveBeenCalledWith({ limit: 10, page: 1 });
    });

    it('should throw error in paginate tasks', async () => {
        paginateTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.paginate({ limit: 10, page: 1 });
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(paginateTaskSpy).toHaveBeenCalledTimes(1);
            expect(paginateTaskSpy).toHaveBeenCalledWith({ limit: 10, page: 1 });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });
});