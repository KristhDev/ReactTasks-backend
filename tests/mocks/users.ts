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
    password: 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586',
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
    password: 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

export const passwordOfUserHashedMock = 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586';

export const userHashedPassMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: Encrypt.createHash(passwordOfUserHashedMock),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;

export const userVerfiedHashedPassMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: Encrypt.createHash(passwordOfUserHashedMock),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;