/* Database */
import { TokenModel } from '@database';

/* Auth */
import { Token } from '@auth';

export const tokenModelMock: TokenModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    token: 'token',
    expiresIn: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as TokenModel;

export const tokenMock: Token = {
    id: '65cad8ccb2092e00addead85',
    token: 'token',
    expiresIn: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}