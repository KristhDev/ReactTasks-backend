import mongoose from 'mongoose';

/* Server */
import { Logger } from '@server';

class Database {

    /**
     * Connects to the database.
     *
     * @return {Promise<void>} a promise that resolves when the connection is established
     */
    public async connect(): Promise<void> {
        try {
            await mongoose.connect(process.env.DATABASE_URL!);
            Logger.info('Database connected');
        } 
        catch (error) {
            Logger.error((error as Error).message);
        }
    }
}

export default Database;