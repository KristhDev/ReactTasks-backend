import dotenv from 'dotenv';
import 'module-alias/register';
import './paths';

dotenv.config();

import { Server } from '@server';

const server = new Server();
server.listen();