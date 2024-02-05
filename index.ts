import dotenv from 'dotenv';
import 'module-alias/register';

import { Server } from '@server';

dotenv.config();

const server = new Server();
server.listen();