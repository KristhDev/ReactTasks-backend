import mongoose from 'mongoose';

/* Server */
import { Logger } from '@server';

/* Utils */
import { DatabaseError } from './utils';

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
            throw new DatabaseError((error as Error).message);
        }
    }

    /**
     * A method to disconnect from the database.
     *
     * @return {Promise<void>} Promise that resolves once the disconnection is complete
     */
    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            Logger.info('Database disconnected');
        } 
        catch (error) {
            Logger.error((error as Error).message);
            throw new DatabaseError((error as Error).message);
        }
    }
}

export default Database;