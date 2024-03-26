/* Mocks */
import { taskMock, taskModelMock } from '@mocks';

/* Database */
import { DatabaseError, TaskSchema, TaskRepository } from '@database';

const createTaskSpy = jest.spyOn(TaskSchema, 'create');
const deleteManyTaskSpy = jest.spyOn(TaskSchema, 'deleteMany');
const deleteOneTaskSpy = jest.spyOn(TaskSchema, 'deleteOne');
const findOneTaskSpy = jest.spyOn(TaskSchema, 'findOne');
const findByIdAndUpdateTaskSpy = jest.spyOn(TaskSchema, 'findByIdAndUpdate');
const insertManyTaskSpy = jest.spyOn(TaskSchema, 'insertMany');
const paginateTaskSpy = jest.spyOn(TaskSchema, 'paginate');

describe('Test in TaskRepository of database module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create task', async () => {
        createTaskSpy.mockResolvedValue(taskModelMock as any);

        const task = await TaskRepository.create({
            userId: taskModelMock.userId,
            title: taskModelMock.title,
            description: taskModelMock.description,
            deadline: taskModelMock.deadline
        });

        expect(task).toEqual({
            ...taskMock,
            deadline: new Date(task.deadline).toISOString(),
            createdAt: new Date(taskMock.createdAt).toISOString(),
            updatedAt: new Date(taskMock.updatedAt).toISOString()
        });

        expect(createTaskSpy).toHaveBeenCalledTimes(1);
        expect(createTaskSpy).toHaveBeenCalledWith({
            userId: taskModelMock.userId,
            title: taskModelMock.title,
            description: taskModelMock.description,
            deadline: taskModelMock.deadline
        });
    });

    it('should throw error in create task', async () => {
        createTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.create({
                userId: taskModelMock.userId,
                title: taskModelMock.title,
                description: taskModelMock.description,
                deadline: taskModelMock.deadline
            });

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(createTaskSpy).toHaveBeenCalledTimes(1);
            expect(createTaskSpy).toHaveBeenCalledWith({
                userId: taskModelMock.userId,
                title: taskModelMock.title,
                description: taskModelMock.description,
                deadline: taskModelMock.deadline
            });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete many tasks', async () => {
        deleteManyTaskSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TaskRepository.deleteMany({ id: taskMock.id });

        expect(deleteManyTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteManyTaskSpy).toHaveBeenCalledWith({ _id: taskMock.id });
    });

    it('should throw error in delete many tasks', async () => {
        deleteManyTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.deleteMany({ id: taskMock.id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteManyTaskSpy).toHaveBeenCalledTimes(1);
            expect(deleteManyTaskSpy).toHaveBeenCalledWith({ _id: taskMock.id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should delete one task', async () => {
        deleteOneTaskSpy.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await TaskRepository.deleteOne({ id: taskMock.id });

        expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock.id });
    });

    it('should throw error in delete one task', async () => {
        deleteOneTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.deleteOne({ id: taskMock.id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(deleteOneTaskSpy).toHaveBeenCalledTimes(1);
            expect(deleteOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock.id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should transform a Task object to a TaskEndpoint object', () => {
        const taskEndpoint = TaskRepository.toEndpoint(taskMock);

        expect(taskEndpoint).toEqual({
            id: taskMock.id,
            userId: taskMock.userId,
            title: taskMock.title,
            description: taskMock.description,
            deadline: taskMock.deadline,
            status: taskMock.status,
            createdAt: taskMock.createdAt,
            updatedAt: taskMock.updatedAt
        });
    });

    it('should find one task', async () => {
        findOneTaskSpy.mockResolvedValue(taskModelMock);

        const task = await TaskRepository.findOne({ id: taskModelMock._id });

        expect(task).toEqual({
            ...taskMock,
            image: taskMock.image,
            deadline: new Date(task!.deadline).toISOString(),
            createdAt: new Date(taskMock.createdAt).toISOString(),
            updatedAt: new Date(taskMock.updatedAt).toISOString()
        });

        expect(findOneTaskSpy).toHaveBeenCalledTimes(1);
        expect(findOneTaskSpy).toHaveBeenCalledWith({ _id: taskModelMock._id });
    });

    it('should throw error in find one task', async () => {
        findOneTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.findOne({ id: taskMock.id });
            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(findOneTaskSpy).toHaveBeenCalledTimes(1);
            expect(findOneTaskSpy).toHaveBeenCalledWith({ _id: taskMock.id });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should find by id and update task', async () => {
        findByIdAndUpdateTaskSpy.mockResolvedValue(taskModelMock);

        const task = await TaskRepository.findByIdAndUpdate(taskMock.id, { title: taskMock.title });

        expect(task).toEqual({
            ...taskMock,
            image: taskMock.image,
            deadline: new Date(task!.deadline).toISOString(),
            createdAt: new Date(taskMock.createdAt).toISOString(),
            updatedAt: new Date(taskMock.updatedAt).toISOString()
        });

        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock.id, { title: taskMock.title }, { new: true });
    });

    it('should throw error in find by id and update task', async () => {
        findByIdAndUpdateTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.findByIdAndUpdate(taskMock.id, { title: taskMock.title });
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledTimes(1);
            expect(findByIdAndUpdateTaskSpy).toHaveBeenCalledWith(taskMock.id, { title: taskMock.title }, { new: true });

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should insert many tasks', async () => {
        insertManyTaskSpy.mockResolvedValue([ taskModelMock, taskModelMock ]);

        const tasks = await TaskRepository.insertMany([ 
            { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline },
            { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline }
        ]);

        expect(tasks).toEqual([
            {
                ...taskMock,
                image: taskMock.image,
                deadline: expect.any(String),
                createdAt: new Date(taskMock.createdAt).toISOString(),
                updatedAt: new Date(taskMock.updatedAt).toISOString()
            },
            {
                ...taskMock,
                image: taskMock.image,
                deadline: expect.any(String),
                createdAt: new Date(taskMock.createdAt).toISOString(),
                updatedAt: new Date(taskMock.updatedAt).toISOString()
            }
        ]);

        expect(insertManyTaskSpy).toHaveBeenCalledTimes(1);
        expect(insertManyTaskSpy).toHaveBeenCalledWith([
            { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline },
            { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline }
        ]);
    });

    it('should throw error in insert many tasks', async () => {
        insertManyTaskSpy.mockImplementation(() => { throw new Error('Database error'); });

        try {
            await TaskRepository.insertMany([
                { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline },
                { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline }
            ]);

            expect(true).toBeFalsy();
        } 
        catch (error) {
            expect(insertManyTaskSpy).toHaveBeenCalledTimes(1);
            expect(insertManyTaskSpy).toHaveBeenCalledWith([
                { userId: taskModelMock.userId, title: taskModelMock.title, description: taskMock.description, deadline: taskModelMock.deadline },
                { userId: taskModelMock.userId, title: taskModelMock.title, description: taskModelMock.description, deadline: taskModelMock.deadline }
            ]);

            expect(error).toBeInstanceOf(DatabaseError);
            expect(error).toHaveProperty('name', 'DatabaseError');
            expect(error).toHaveProperty('message', 'Database error');
        }
    });

    it('should paginate tasks', async () => {
        paginateTaskSpy.mockResolvedValue({
            docs: [ taskModelMock ],
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
            tasks: [
                {
                    ...taskMock,
                    image: taskMock.image,
                    deadline: new Date(taskModelMock.deadline).toISOString(),
                    createdAt: new Date(taskMock.createdAt).toISOString(),
                    updatedAt: new Date(taskMock.updatedAt).toISOString()
                }
            ],
            pagination: {
                currentPage: 1,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: 1,
                totalPages: 1
            }
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