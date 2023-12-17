import mongoose from 'mongoose';

class Database {

    /**
     * Connects to the database.
     *
     * @return {Promise<void>} a promise that resolves when the connection is established
     */
    public async connect(): Promise<void> {
        try {
            await mongoose.connect(process.env.DATABASE_URL!);
            console.log('Database connected');
        } 
        catch (error) {
            console.log(error);
        }
    }
}

export default Database;