import { getMockReq, getMockRes } from '@jest-mock/express';
import { MockRequest } from '@jest-mock/express/dist/src/request';
import { NextFunction, Request, Response } from 'express';

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