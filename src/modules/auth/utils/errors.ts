export const AuthErrorMessages = {
    EMAIL_EXISTS: 'El correo ya existe.',
    EMAIL_INVALID: 'El correo no es valido.',
    EMAIL_REQUIRED: 'El correo es requerido.',
    EMAIL_TYPE: 'El correo debe ser una cadena.',
    INVALID_CREDENTIALS: 'Las credenciales son incorrectas.',
    LASTNAME_MIN_LENGTH: 'Los apellidos deben tener al menos 5 caracteres.',
    LASTNAME_REQUIRED: 'Los apellidos son requeridos.',
    LASTNAME_TYPE: 'Los apellidos deben ser una cadena.',
    NAME_MIN_LENGTH: 'El nombre debe tener al menos 3 caracteres.',
    NAME_REQUIRED: 'El nombre es requerido.',
    NAME_TYPE: 'El nombre debe ser una cadena.',
    NEW_PASSWORD: 'La nueva contraseña debe ser diferente a la anterior.',
    NOT_FOUND: 'El usuario no existe.',
    PASSWORD_CONFIRMATION: 'Las contraseñas no coinciden.',
    PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres.',
    PASSWORD_REQUIRED: 'La contraseña es requerida.',
    PASSWORD_TYPE: 'La contraseña debe ser una cadena.',
    UNVERIFIED: 'Tu cuenta no ha sido verificada.',
    VERIFICATION_EXPIRED: 'El enlace de verificación ha expirado, por favor solicita otro enlace de verificación.',
}

export class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmailError';
    }
}

export class JWTError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JWTError';
    }
}

export const JWTErrorMessages = {
    EXPIRED: 'Su tiempo de sesión ha expirado. Por favor, inicie sesión de nuevo.',
    REVOKED: 'El token ya ha sido revocado.'
}