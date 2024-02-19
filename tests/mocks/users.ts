/* Database */
import { UserModel } from '@database';

/* Auth */
import { Encrypt } from '@auth';

export const userMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: 'tutuyoyo9102',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

export const userVerifiedMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: 'tutuyoyo9102',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

export const userHashedPassMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: Encrypt.createHash('tutuyoyo9102'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;