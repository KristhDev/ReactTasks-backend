/* Test */
import { createRequestMock, createResponseMock } from '@test';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserModel, UserRepository } from '@database';

/* Auth */
import { AuthErrorMessages, userExists } from '@auth';

const userMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: 'tutuyoyo9102',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

const findOneUserSpy = jest.spyOn(UserRepository, 'findOne');

describe('Test in middleware userExists of auth module', () => {
    const { mockClear, next: nextMock, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should call next function', async () => {
        const req = createRequestMock({ 
            body: { email: userMock.email } 
        });

        findOneUserSpy.mockResolvedValue(userMock);

        await userExists(req, res, nextMock);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userMock.email });
        expect(req.user).toEqual(userMock);
        expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should not call next function because user not found', async () => {
        const req = createRequestMock({ 
            body: { email: userMock.email } 
        });

        findOneUserSpy.mockResolvedValue(null);

        await userExists(req, res, nextMock);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userMock.email });

        expect(req.user).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.NOT_FOUND);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            status: Http.NOT_FOUND,
            msg: AuthErrorMessages.NOT_FOUND
        });
    });

    it('should not call next function because throw a error', async () => {
        const req = createRequestMock({ 
            body: { email: userMock.email } 
        });

        findOneUserSpy.mockImplementation(() => { throw new Error('Database error') });

        await userExists(req, res, nextMock);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userMock.email });

        expect(req.user).toBeUndefined();
        expect(nextMock).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR,
        });
    });
});