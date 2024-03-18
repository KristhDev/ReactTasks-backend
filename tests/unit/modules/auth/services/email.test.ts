import nodemailer from 'nodemailer';

/* Auth */
import { EmailError, EmailService } from '@auth';

const sendEmailMock = jest.fn();
const useMock = jest.fn();

jest.spyOn(nodemailer, 'createTransport')
    .mockImplementation(() => ({ sendMail: sendEmailMock, use: useMock } as any));

const data = {
    email: 'test-e2e@gmail.com',
    name: 'Test',
    token: 'Test-token'
}

describe('Test in EmailService of auth module', () => {
    EmailService.initialize();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send email verification', async () => {
        await EmailService.sendEmailVerification(data);

        expect(sendEmailMock).toHaveBeenCalledTimes(1);

        expect(sendEmailMock).toHaveBeenCalledWith({
            from: `no-reply <${ process.env.EMAIL_USER }>`,
            to: data.email,
            subject: 'Verificación de correo - ReactTasks',
            text: expect.stringContaining(data.token),
            html: expect.any(String)
        });

        expect(sendEmailMock).toHaveBeenCalledWith({
            from: `no-reply <${ process.env.EMAIL_USER }>`,
            to: data.email,
            subject: 'Verificación de correo - ReactTasks',
            text: expect.stringContaining(data.name),
            html: expect.any(String)
        });
    });

    it('should faild send email verification because throw error', async () => {
        sendEmailMock.mockImplementation(() => { throw new Error(); });

        try {
            await EmailService.sendEmailVerification(data);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error).toBeInstanceOf(EmailError);
        }
    });

    it('should send email reset password', async () => {
        sendEmailMock.mockRestore();

        await EmailService.sendEmailResetPassword(data);

        expect(sendEmailMock).toHaveBeenCalledTimes(1);

        expect(sendEmailMock).toHaveBeenCalledWith({
            from: `no-reply <${ process.env.EMAIL_USER }>`,
            to: data.email,
            subject: 'Reestablecer contraseña - ReactTasks',
            text: expect.stringContaining(data.token),
            html: expect.any(String)
        });

        expect(sendEmailMock).toHaveBeenCalledWith({
            from: `no-reply <${ process.env.EMAIL_USER }>`,
            to: data.email,
            subject: 'Reestablecer contraseña - ReactTasks',
            text: expect.stringContaining(data.name),
            html: expect.any(String)
        });
    });

    it('should faild email reset password because throw error', async () => {
        sendEmailMock.mockImplementation(() => { throw new Error(); });

        try {
            await EmailService.sendEmailResetPassword(data);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error).toBeInstanceOf(EmailError);
        }
    });
});