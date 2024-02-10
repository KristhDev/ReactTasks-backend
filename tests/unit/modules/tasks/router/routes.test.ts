/* Tasks */
import { taskRoutes } from '@tasks';

describe('Test in routes of tasks module', () => {
    it('should to match snapshot', () => {
        expect(taskRoutes).toMatchSnapshot();
    });
});