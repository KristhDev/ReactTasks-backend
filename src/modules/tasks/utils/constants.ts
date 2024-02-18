/* Database */
import { TaskStatus } from '@database';

class Constants {
    public static readonly ACCEPTED_TASK_STATUSES: TaskStatus[] = [ 'pending', 'completed', 'in-progress' ];
}

export default Constants;