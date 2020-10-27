import { phoneValidator } from './phone-validator';
import { PhoneFormatter } from '../formatters/phone-formatter';

describe('phoneValidator', () => {
    const PHONE_ERROR = {
        phone: true
    };

    let formatter: PhoneFormatter;
    let validate;

    beforeEach(() => {
        formatter = new PhoneFormatter();
        validate = phoneValidator(formatter);
    });

    it('should create a function to validate the form control', () => {
        expect(validate).toBeTruthy();
    });

    it('should return null if the control value is empty', () => {
        const control = {
            value: ''
        };
        expect(validate(control)).toBeNull();
    });

    it('should return null if valid, formatted value is passed in', () => {
        const control = {
            value: formatter.format('2345678901')
        };
        expect(validate(control)).toBeNull();
    });

    it('should return "phone" error if value is formatted incorrectly', () => {
        const control = {
            value: '2345678901'
        };
        expect(validate(control)).toEqual(PHONE_ERROR);
    });

    it(`should return "phone" error if value doesn't have enough digits`, () => {
        const control = {
            value: formatter.format('2341')
        };
        expect(validate(control)).toEqual(PHONE_ERROR);
    });

    it(`should return "phone" error if value starts with "0"`, () => {
        const control = {
            value: formatter.format('0234567891')
        };
        expect(validate(control)).toEqual(PHONE_ERROR);
    });

    it(`should return "phone" error if value starts with "1"`, () => {
        const control = {
            value: formatter.format('1023456789')
        };
        expect(validate(control)).toEqual(PHONE_ERROR);
    });
});
