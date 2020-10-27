import { PhoneFormatter } from './phone-formatter';

describe('PhoneFormatter', () => {
    let formatter: PhoneFormatter;

    beforeEach(() => {
        formatter = new PhoneFormatter();
    });

    describe('insertSpecialChars', () => {
        it('should not modify strings less than 3 characters', () => {
            expect(formatter.insertSpecialChars('')).toEqual('');
            expect(formatter.insertSpecialChars('1')).toEqual('1');
            expect(formatter.insertSpecialChars('12')).toEqual('12');
        });

        it('should wrap first 3 digits in parentheses and add a space before next digits', () => {
            expect(formatter.insertSpecialChars('123')).toEqual('123-');
            expect(formatter.insertSpecialChars('1234')).toEqual('123-4');
            expect(formatter.insertSpecialChars('12345')).toEqual('123-45');
        });

        it('should add a dash between the first 6 digits and the last 4 digits', () => {
            expect(formatter.insertSpecialChars('123456')).toEqual('123-456-');
            expect(formatter.insertSpecialChars('1234567')).toEqual('123-456-7');
            expect(formatter.insertSpecialChars('12345678')).toEqual('123-456-78');
            expect(formatter.insertSpecialChars('123456789')).toEqual('123-456-789');
            expect(formatter.insertSpecialChars('1234567890')).toEqual('123-456-7890');
        });

        it('should not allow more than 10 digits', () => {
            expect(formatter.insertSpecialChars('12345678901')).toEqual('123-456-7890');
        });
    });

    describe('format', () => {
        it('should remove all non digit numbers and insert special characters', () => {
            expect(formatter.format('a0s9;8.7/6=5,4`3-2(1)')).toEqual('098-765-4321');
        });
    });
});
