import dotenv from 'dotenv';
import 'module-alias/register';
import '../../../paths';

dotenv.config();

/* Server */
import { Logger } from '@server';

/* Database */
import { Database, TasksSeeder, UsersSeeder } from '@database';

/**
 * Asynchronous function to seed the data.
 * @return {Promise<void>} Promise that resolves when seeding is complete
 */
const seed = async (): Promise<void> => {
    const database = new Database();

    try {
        await database.connect();

        await TasksSeeder.down();
        await UsersSeeder.down();

        await UsersSeeder.up();
        await TasksSeeder.up();
    } 
    catch (error) {
        Logger.error((error as Error).message);
    }
    finally {
        await database.disconnect();
    }
};

seed();