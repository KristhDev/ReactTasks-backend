/* Tasks */
import { TaskErrorMessages } from '@tasks';

describe('Test in util errors of tasks module', () => {
    it('should to match snapshot - TaskErrorMessages', () => {
        expect(TaskErrorMessages).toMatchSnapshot();
    });
});