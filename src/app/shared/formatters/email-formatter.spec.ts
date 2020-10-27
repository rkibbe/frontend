import { EmailFormatter } from './email-formatter';

describe('EmailFormatter', () => {
    let formatter: EmailFormatter;

    beforeEach(() => {
        formatter = new EmailFormatter();
    });

    it('should remove unwanted characters', () => {
        expect(formatter.format('1234asFD -5@/\\=,.')).toEqual('1234asFD-5@.');
    });
});
