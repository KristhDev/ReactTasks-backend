/* Auth */
import { usersRoutes } from '@auth';

describe('Test in routes of auth module', () => {
    it('should to match snapshot', () => {
        expect(usersRoutes).toMatchSnapshot();
    });
});