import dotenv from 'dotenv';
import 'module-alias/register';
import './paths';

import { Server } from '@server';

dotenv.config();

const server = new Server();
server.listen();