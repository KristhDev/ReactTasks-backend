import fs from 'fs';
import { faker } from '@faker-js/faker';

import 'module-alias/register';
import '../../../paths';

/* Server */
import { Logger } from '@server';

/**
 * Generates a .env file with predefined configuration data and logs the process.
 * @return {void} This function does not return anything.
 */
const env = (): void => {
    Logger.info('Creating .env file');

    try {
        const ids = [ faker.string.uuid(), faker.string.uuid() ];
        const currentDate = new Date().toISOString();

        const authSecret = `react-tasks-${ currentDate }-${ ids[0] }`;
        const jwtSecret = `react-tasks-${ currentDate }-${ ids[1] }`;

        let data = '# Auth \n';
        data = data += `AUTH_SECRET=${ authSecret }\n`;
        data = data += '\n';

        data = data += '# Cloudinary \n';
        data = data += 'CLOUDINARY_API_KEY=\n';
        data = data += 'CLOUDINARY_API_SECRET=\n';
        data = data += 'CLOUDINARY_CLOUD_NAME=\n';
        data = data += 'CLOUDINARY_TASKS_FOLDER=\n';
        data = data += '\n';

        data = data += '# Database \n';
        data = data += 'DATABASE_CONTAINER_NAME=\n';
        data = data += 'DATABASE_USER=\n';
        data = data += 'DATABASE_PASSWORD=\n';
        data = data += 'DATABASE_URL=\n';
        data = data += '\n';

        data = data += '# Email \n';
        data = data += 'EMAIL_HOST=\n';
        data = data += 'EMAIL_PASSWORD=\n';
        data = data += 'EMAIL_PORT=\n';
        data = data += 'EMAIL_USER=\n';
        data = data += '\n';

        data = data += '# JWT \n';
        data = data += `JWT_SECRET=${ jwtSecret }\n`;
        data = data += '\n';

        data = data += '# Server \n';
        data = data += 'PORT=9000\n';

        fs.writeFileSync('./.env', data);

        Logger.success('.env file created');
    } 
    catch (error) {
        Logger.error('Failed to create .env file');
        Logger.error((error as Error).message);
    }
}

env();