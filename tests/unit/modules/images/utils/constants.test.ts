/* Images */
import { Constants } from '@images';

describe('Test in util Constants of images module', () => {
    it('should contain png, jpg and jpeg in ACCEPTED_IMAGE_TYPES', () => {
        expect(Constants.ACCEPTED_IMAGE_TYPES)
            .toEqual(expect.arrayContaining(['image/png', 'image/jpg', 'image/jpeg' ]));
    });
})