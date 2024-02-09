import { faker } from '@faker-js/faker';

/* Server */
import { Logger } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { Encrypt } from '@auth';

export class UsersSeeder {
    /**
     * Asynchronously seeds users into the database.
     *
     * @return {Promise<void>} A Promise that resolves when the seeding is complete
     */
    public static async up(): Promise<void> {
        try {
            Logger.info('Seeding users');

            const data = Array.from({ length: 10 }, () => ({
                name: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                verified: true,
                password: Encrypt.createHash('password-123456'),
            }));

            const testUser = {
                name: 'Tester',
                lastname: 'E2E-UNIT',
                email: 'tester@gmail.com',
                verified: true,
                password: Encrypt.createHash('tutuyoyo9102')
            }

            await UserRepository.insertMany([ ...data, testUser ]);
            Logger.success('Users seeded successfully');
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Asynchronously deletes users and logs the process.
     *
     * @return {Promise<void>} A promise that resolves with no value on successful deletion.
     */
    public static async down(): Promise<void> {
        try {
            Logger.info('Deleting users');
            await UserRepository.deleteMany({});
            Logger.success('Users deleted successfully');
        } 
        catch (error) {
            throw error;
        }
    }
}