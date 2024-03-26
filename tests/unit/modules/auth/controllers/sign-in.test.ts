/* Mocks */
import { 
    createRequestMock,
    createResponseMock,
    passwordOfUserHashedMock,
    userHashedPassMock,
    userVerfiedHashedPassMock
} from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository } from '@database';

/* Modules */
import { AuthErrorMessages, Encrypt, JWT, SignInController } from '@auth';

const findOneUserSpy = jest.spyOn(UserRepository, 'findOne');
const compareHashSpy = jest.spyOn(Encrypt, 'compareHash');
const generateTokenSpy = jest.spyOn(JWT, 'generateToken');

describe('Test in SignInController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(SignInController).toHaveProperty('handler');
    });

    it('should return a authenticated user', async () => {
        findOneUserSpy.mockResolvedValue(userVerfiedHashedPassMock);

        const bodyMock = {
            email: userVerfiedHashedPassMock.email, 
            password: passwordOfUserHashedMock 
        }

        const req = createRequestMock({ body: bodyMock });

        await SignInController.handler(req, res);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userVerfiedHashedPassMock.email });

        expect(compareHashSpy).toHaveBeenCalledTimes(1);
        expect(compareHashSpy).toHaveBeenCalledWith(bodyMock.password, userVerfiedHashedPassMock.password);

        expect(generateTokenSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledWith({ id: userVerfiedHashedPassMock.id });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has ingresado correctamente.',
            status: Http.OK,
            user: UserRepository.toEndpoint(userVerfiedHashedPassMock),
            token: expect.any(String)
        });
    });

    it('should return bad request because user is unverified', async () => {
        findOneUserSpy.mockResolvedValue(userHashedPassMock);

        const bodyMock = {
            email: userHashedPassMock.email,
            password: passwordOfUserHashedMock
        }

        const req = createRequestMock({ body: bodyMock });

        await SignInController.handler(req, res);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userHashedPassMock.email });

        expect(compareHashSpy).not.toHaveBeenCalled();
        expect(generateTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.UNVERIFIED,
            status: Http.BAD_REQUEST
        });
    });

    it('should return bad request because password not match', async () => {
        findOneUserSpy.mockResolvedValue(userVerfiedHashedPassMock);

        const bodyMock = {
            email: userVerfiedHashedPassMock.email,
            password: 'password'
        }

        const req = createRequestMock({ body: bodyMock });

        await SignInController.handler(req, res);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userVerfiedHashedPassMock.email });

        expect(compareHashSpy).toHaveBeenCalledTimes(1);
        expect(compareHashSpy).toHaveBeenCalledWith(bodyMock.password, userVerfiedHashedPassMock.password);

        expect(generateTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.INVALID_CREDENTIALS,
            status: Http.BAD_REQUEST
        });
    });

    it('should return internal server error', async () => {
        findOneUserSpy.mockRejectedValue(new Error('Database error'));

        const bodyMock = {
            email: userVerfiedHashedPassMock.email,
            password: passwordOfUserHashedMock
        }

        const req = createRequestMock({ body: bodyMock });

        await SignInController.handler(req, res);

        expect(findOneUserSpy).toHaveBeenCalledTimes(1);
        expect(findOneUserSpy).toHaveBeenCalledWith({ email: userVerfiedHashedPassMock.email });

        expect(compareHashSpy).not.toHaveBeenCalled();
        expect(generateTokenSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});