/* Mocks */
import { 
    createRequestMock, 
    createResponseMock, 
    userMock, 
    userVerifiedMock, 
    verificationEmailMock, 
    verificationTokenMock 
} from '@mocks';

/* Server */
import { Http, ServerErrorMessages } from '@server';

/* Database */
import { UserRepository, VerificationRepository } from '@database';

/* Auth */
import { AuthErrorMessages, VerifyEmailController } from '@auth';

const findByIdAndUpdateUserSpy = jest.spyOn(UserRepository, 'findByIdAndUpdate');
const findByIdUserSpy = jest.spyOn(UserRepository, 'findById');
const findOneVerificationSpy = jest.spyOn(VerificationRepository, 'findOne');
const deleteOneVerificationSpy = jest.spyOn(VerificationRepository, 'deleteOne');

describe('Test in VerifyEmailController of auth module', () => {
    const { mockClear, res } = createResponseMock();

    beforeEach(() => {
        jest.clearAllMocks();
        mockClear();
    });

    it('should has handler method', () => {
        expect(VerifyEmailController).toHaveProperty('handler');
    });

    it('should return a success response', async () => {
        findOneVerificationSpy.mockResolvedValue(verificationEmailMock);
        findByIdUserSpy.mockResolvedValue(userMock);
        findByIdAndUpdateUserSpy.mockImplementation(() => Promise.resolve() as any);
        deleteOneVerificationSpy.mockImplementation(() => Promise.resolve() as any);

        const req = createRequestMock({
            query: { token: verificationTokenMock },
            tokenExpiration: verificationEmailMock.expiresIn
        });

        await VerifyEmailController.handler(req, res);

        expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(findOneVerificationSpy).toHaveBeenCalledWith({ 
            token: verificationTokenMock, 
            expiresIn: verificationEmailMock.expiresIn 
        });

        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledWith(verificationEmailMock.userId);

        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdAndUpdateUserSpy).toHaveBeenCalledWith(verificationEmailMock.userId, { verified: true });

        expect(deleteOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneVerificationSpy).toHaveBeenCalledWith({ _id: verificationEmailMock._id });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.OK);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Has verificado tu cuenta correctamente, ya puedes iniciar sesión.',
            status: Http.OK
        });
    });

    it('should return bad request because verification not found', async () => {
        findOneVerificationSpy.mockResolvedValue(null);

        const req = createRequestMock({
            query: { token: verificationTokenMock },
            tokenExpiration: verificationEmailMock.expiresIn
        });

        await VerifyEmailController.handler(req, res);

        expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(findOneVerificationSpy).toHaveBeenCalledWith({
            token: verificationTokenMock,
            expiresIn: verificationEmailMock.expiresIn
        });

        expect(findByIdUserSpy).not.toHaveBeenCalled();
        expect(findByIdAndUpdateUserSpy).not.toHaveBeenCalled();

        expect(deleteOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(deleteOneVerificationSpy).toHaveBeenCalledWith({ token: verificationTokenMock });

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: AuthErrorMessages.VERIFICATION_EXPIRED,
            status: Http.BAD_REQUEST
        });
    });

    it('should return bad request because user is verified', async () => {
        findOneVerificationSpy.mockResolvedValue(verificationEmailMock);
        findByIdUserSpy.mockResolvedValue(userVerifiedMock);

        const req = createRequestMock({
            query: { token: verificationTokenMock },
            tokenExpiration: verificationEmailMock.expiresIn
        });

        await VerifyEmailController.handler(req, res);

        expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(findOneVerificationSpy).toHaveBeenCalledWith({
            token: verificationTokenMock,
            expiresIn: verificationEmailMock.expiresIn
        });

        expect(findByIdUserSpy).toHaveBeenCalledTimes(1);
        expect(findByIdUserSpy).toHaveBeenCalledWith(verificationEmailMock.userId);

        expect(findByIdAndUpdateUserSpy).not.toHaveBeenCalled();
        expect(deleteOneVerificationSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.BAD_REQUEST);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Tu cuenta ya ha sido verificada.',
            status: Http.BAD_REQUEST
        });
    });

    it('should return internal server error', async () => {
        findOneVerificationSpy.mockRejectedValue(new Error('Database error'));

        const req = createRequestMock({
            query: { token: verificationTokenMock },
            tokenExpiration: verificationEmailMock.expiresIn
        });

        await VerifyEmailController.handler(req, res);

        expect(findOneVerificationSpy).toHaveBeenCalledTimes(1);
        expect(findOneVerificationSpy).toHaveBeenCalledWith({
            token: verificationTokenMock,
            expiresIn: verificationEmailMock.expiresIn
        });

        expect(findByIdAndUpdateUserSpy).not.toHaveBeenCalled();
        expect(deleteOneVerificationSpy).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(Http.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            msg: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            status: Http.INTERNAL_SERVER_ERROR
        });
    });
});