import dotenv from 'dotenv';
import supertest from 'supertest';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { MockRequest } from '@jest-mock/express/dist/src/request';
import { NextFunction, Request, Response } from 'express';
import './paths';

dotenv.config();

/* Server */
import { Server } from '@server';

const server = new Server();

jest.setTimeout(30000);

export const request = supertest(server.getApp());

/**
 * Creates a request mock using the provided values.
 *
 * @param {MockRequest} values - the values for creating the mock request
 * @return {Request} the created mock request
 */
export const createRequestMock = (values?: MockRequest): Request => {
    return getMockReq(values);
}

export interface MockResponse {
    clearMockRes: () => void;
    mockClear: () => void;
    next: NextFunction;
    res: Response;
}

/**
 * Creates a mock response.
 *
 * @return {MockResponse} The mock response created.
 */
export const createResponseMock = (): MockResponse => {
    return getMockRes();

}