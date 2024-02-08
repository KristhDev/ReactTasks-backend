import { AuthErrorMessages, EmailError, JWTError, JWTErrorMessages, VerificationsErrorMessages } from '@auth';

describe('Test in util errors of auth module', () => {
    it('should to match snapshot - AuthErrorMessages', () => {
        expect(AuthErrorMessages).toMatchSnapshot();
    });

    it('should to match snapshot - JWTErrorMessages', () => {
        expect(JWTErrorMessages).toMatchSnapshot();
    });

    it('should to match snapshot - VerificationsErrorMessages', () => {
        expect(VerificationsErrorMessages).toMatchSnapshot();
    });

    it('should render properties in error instance - EmailError', () => {
        const error = new EmailError('invalid email');

        expect(error.message).toBe('invalid email');
        expect(error.name).toBe('EmailError');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(EmailError);
    });

    it('should render properties in error instance - JWTError', () => {
        const error = new JWTError('invalid token');

        expect(error.message).toBe('invalid token');
        expect(error.name).toBe('JWTError');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(JWTError);
    });
});