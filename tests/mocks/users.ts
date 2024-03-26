/* Database */
import { UserModel } from '@database';

/* Auth */
import { Encrypt, User } from '@auth';

export const userMock: User = {
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

export const userModelMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
} as UserModel

export const userVerifiedMock: User = {
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

export const userModelVerifiedMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
} as UserModel

export const passwordOfUserHashedMock = 'e583fb9e-ac7c-42e7-a324-1e1a9fba6586';
export const passwordHashedOfUserHashedMock = Encrypt.createHash(passwordOfUserHashedMock);

export const userHashedPassMock: User = {
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: passwordHashedOfUserHashedMock,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

export const userHashedPassModelMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: false,
    password: passwordHashedOfUserHashedMock,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel

export const userVerfiedHashedPassMock: User = {
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: passwordHashedOfUserHashedMock,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

export const userVerfiedHashedPassModelMock: UserModel = {
    _id: '65cad8ccb2092e00addead85',
    id: '65cad8ccb2092e00addead85',
    name: 'User name',
    lastname: 'User lastname',
    email: 'tester-unit@gmail.com',
    verified: true,
    password: passwordHashedOfUserHashedMock,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
} as UserModel;