/* Interfaces */
import { UserModel } from '../../../database';
import { UserEndpoint } from '../interfaces';

export const userEndpointAdapter = (user: UserModel): UserEndpoint => ({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt!,
    updatedAt: user.updatedAt!
});