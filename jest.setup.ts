import dotenv from 'dotenv';
import supertest from 'supertest';

dotenv.config();

/* Server */
import { Server } from './src/server';

const server = new Server();

export const request = supertest(server.getApp());