/* Interfaces */
import { UserModel } from '../../../database';
import { UserEndpoint } from '../interfaces';

/**
 * Converts a UserModel object to a UserEndpoint object.
 *
 * @param {UserModel} user - The UserModel object to be converted.
 * @return {UserEndpoint} The converted UserEndpoint object.
 */
export const userEndpointAdapter = (user: UserModel): UserEndpoint => ({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt!,
    updatedAt: user.updatedAt!
});