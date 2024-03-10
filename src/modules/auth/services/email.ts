import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

/* Auth */
import { EmailError, SendEmailOptions } from '@auth';

class EmailService {
    private static transporter: Transporter<SMTPTransport.SentMessageInfo>;

    /**
     * Initialize the EmailService by creating a transporter using the provided
     * environment variables. The transporter is responsible for sending emails.
     * 
     * This function does not have any parameters.
     * 
     * @return {void} This function does not return anything.
     */
    public static initialize(): void {
        EmailService.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465'),
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Sends an email verification.
     *
     * @param {SendEmailOptions} options - The options for sending the email verification.
     * @param {string} options.email - The email address to send the verification to.
     * @param {string} options.token - The verification token.
     * @param {string} options.name - The name of the recipient.
     * @returns {Promise<void>} - A Promise that resolves when the email verification is sent.
     */
    public static async sendEmailVerification({ email, token, name }: SendEmailOptions): Promise<void> {
        try {
            await EmailService.transporter.sendMail({
                from: `no-reply <${ process.env.EMAIL_USER }>`,
                to: email,
                subject: 'Verificación de correo - ReactTasks',
                text: `
                    Hola, ${ name }.
                    Te enviamos este correo para verificar tu cuenta.

                    Has click en el siguiente enlace:

                    ${ process.env.CLIENT_URL }/verify-email?token=${ token }
                `
            });
        } 
        catch (error) {
            throw new EmailError((error as any).message);
        }
    }

    /**
     * Sends a password reset email.
     *
     * @param {SendEmailOptions} email - The email address to send the reset link to.
     * @param {string} token - The token to include in the reset link.
     * @param {string} name - The name of the user receiving the email.
     * @return {Promise<void>} - A promise that resolves when the email is sent successfully.
     */
    public static async sendEmailResetPassword({ email, token, name }: SendEmailOptions): Promise<void> {
        try {
            await EmailService.transporter.sendMail({
                from: `no-reply <${ process.env.EMAIL_USER }>`,
                to: email,
                subject: 'Reestablecer contraseña - ReactTasks',
                text: `
                    Hola, ${ name }.
                    Te enviamos este correo para reestablecer tu contraseña.

                    Has click en el siguiente enlace:

                    ${ process.env.CLIENT_URL }/reset-password?token=${ token }
                `
            });
        } 
        catch (error) {
            throw new EmailError((error as any).message);
        }
    }
}

export default EmailService;