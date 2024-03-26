/* Database */
import { VerificationModel } from '@database';

/* Auth */
import { JWT, Verification } from '@auth';

export const verificationTokenMock = JWT.generateToken({ nothing: 'Nothing' });

export const verificationEmailMock: Verification = {
    id: '65cad8ccb2092e00addead85',
    userId: '65cad8ccb2092e00addead85',
    token: verificationTokenMock,
    type: 'email',
    expiresIn: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const verificationEmailModelMock: VerificationModel = {
    _id: '65cad8ccb2092e00addead85',
    userId: '65cad8ccb2092e00addead85',
    token: verificationTokenMock,
    type: 'email',
    expiresIn: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as VerificationModel;