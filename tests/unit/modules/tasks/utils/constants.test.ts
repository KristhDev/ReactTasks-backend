/* Tasks */
import { Constants } from '@tasks';

describe('Test in util Constants of tasks module', () => {
    it('should contain pending, completed and in-progress in ACCEPTED_TASK_STATUSES', () => {
        expect(Constants.ACCEPTED_TASK_STATUSES).toEqual(expect.arrayContaining(['pending', 'completed', 'in-progress' ]));
    });
});