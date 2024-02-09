import { faker } from '@faker-js/faker';

/* Server */
import { Logger } from '@server';

/* Database */
import { SeederError, TaskRepository, TaskStatus, UserRepository } from '@database';

export class TasksSeeder {
    /**
     * Asynchronous function for seeding tasks.
     *
     * @return {Promise<void>} Promise that resolves when seeding is complete
     */
    public static async up(): Promise<void> {
        try {
            Logger.info('Seeding tasks');

            const users = await UserRepository.find({}, { _id: true });
            if (users.length === 0) throw new SeederError('No users found to create tasks for');

            const tasks = Array.from({ length: users.length * 10 }, () => ({
                userId: faker.helpers.arrayElement(users)._id,
                title: faker.lorem.words({ min: 2, max: 3 }),
                description: faker.lorem.paragraph(),
                deadline: faker.date.future().toISOString(),
                status: faker.helpers.arrayElement<TaskStatus>([ 'completed', 'in-progress', 'pending' ])
            }));

            await TaskRepository.insertMany(tasks);
            Logger.success('Tasks seeded successfully');
        } 
        catch (error) {
            throw error;
        }
    }

    /**
     * Asynchronously deletes tasks from the database.
     *
     * @return {Promise<void>} Promise that resolves when the tasks are deleted successfully
     */
    public static async down(): Promise<void> {
        try {
            Logger.info('Deleting tasks');
            await TaskRepository.deleteMany({});
            Logger.success('Tasks deleted successfully');
        }
        catch (error) {
            throw error;
        }
    }
}