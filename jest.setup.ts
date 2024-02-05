import dotenv from 'dotenv';
import supertest from 'supertest';

dotenv.config();

/* Server */
import { Server } from '@server';

const server = new Server();

jest.setTimeout(30000);

export const request = supertest(server.getApp());