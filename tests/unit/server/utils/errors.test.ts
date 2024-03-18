/* Server */
import { ServerErrorMessages } from '@server';

describe('Test in util errors of server module', () => {
    it('should to match snapshot - ServerErrorMessages', () => {
        expect(ServerErrorMessages).toMatchSnapshot();
    });
});