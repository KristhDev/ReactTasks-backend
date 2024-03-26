/* Mocks */
import { createRequestMock, createResponseMock, userVerifiedMock } from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Auth */
import { UpdateUserController } from '@auth';

const findByIdAndUpdateUserSpy = jest.spyOn(UserRepository, 'findByIdAndUpdate');
const bodyMock = {
    name: 'User name',
    lastname: 'User lastname',
}

describe('Test in UpdateUserController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(UpdateUserController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        findByIdAndUpdateUserSpy.mockResolvedValue({ ...userVerifiedMock, ...bodyMock });

        const req = createRequestMock({
            auth: { user: userVerifiedMock },
            body: bodyMock
        });

        await UpdateUserController.handler(req, res);

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userVerifiedMock.id, bodyMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has actualizado tus datos correctamente.',
            status: Http.OK,
            user: UserRepository.toEndpoint({ ...userVerifiedMock, ...bodyMock } as any),
        });
    });

    it('should return an internal server error', async () => {
        findByIdAndUpdateUserSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({
            auth: { user: userVerifiedMock },
            body: bodyMock
        });

        await UpdateUserController.handler(req, res);

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(userVerifiedMock.id, bodyMock);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});