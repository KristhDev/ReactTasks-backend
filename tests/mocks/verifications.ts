/* Database */
import { VerificationModel } from '@database';

/* Auth */
import { JWT } from '@auth';

export const verificationTokenMock = JWT.generateToken({ nothing: 'Nothing' });

export const verificationEmailMock: VerificationModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    token: verificationTokenMock,
    type: 'email',
    expiresIn: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as VerificationModel;