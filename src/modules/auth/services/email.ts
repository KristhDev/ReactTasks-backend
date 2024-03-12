import fs from 'fs';
import path from 'path';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { htmlToText } from 'nodemailer-html-to-text';
import ejs from 'ejs';

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

        EmailService.transporter.use('compile', htmlToText());
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
            const templateString = fs.readFileSync(path.join(__dirname, '../templates/email-template.ejs'), 'utf8');

            const data = {
                helpText: 'Si no has sido tú quién ha creado esta cuenta, puedes ignorar este correo.',
                linkText: 'Verificar correo',
                name,
                text: 'Te enviamos este correo para verificar tu cuenta.',
                title: 'Verificación de correo',
                url: `${ process.env.CLIENT_URL }/verify-email?token=${ token }`
            }

            const html = ejs.render(templateString, data);

            await EmailService.transporter.sendMail({
                from: `no-reply <${ process.env.EMAIL_USER }>`,
                to: email,
                subject: `${ data.title } - ReactTasks`,
                text: `
                    Hola, ${ name }.
                    ${ data.text }

                    Has click en el siguiente enlace:

                    ${ data.url }

                    ${ data.helpText }
                `,
                html
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
            const templateString = fs.readFileSync(path.join(__dirname, '../templates/email-template.ejs'), 'utf8');

            const data = {
                helpText: 'Si no has sido tú quién solicito un restablecimiento de contraseña, puedes ignorar este correo.',
                linkText: 'Reestablecer contraseña',
                name,
                text: 'Te enviamos este correo para reestablecer tu contraseña.',
                title: 'Reestablecer contraseña',
                url: `${ process.env.CLIENT_URL }/reset-password?token=${ token }`
            }

            const html = ejs.render(templateString, data);

            await EmailService.transporter.sendMail({
                from: `no-reply <${ process.env.EMAIL_USER }>`,
                to: email,
                subject: `${ data.title } - ReactTasks`,
                text: `
                    Hola, ${ name }.
                    ${ data.text }

                    Has click en el siguiente enlace:

                    ${ data.url }

                    ${ data.helpText }
                `,
                html
            });
        } 
        catch (error) {
            throw new EmailError((error as any).message);
        }
    }
}

export default EmailService;