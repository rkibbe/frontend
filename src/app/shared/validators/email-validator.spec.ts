import { emailValidator } from './email-validator';
import { FormControl } from '@angular/forms';

describe('emailValidator', () => {
    const EMAIL_ERROR = {
        email: true
    };

    const VALID_EMAIL_PREFIX = 'valid_email-123.candy';
    const VALID_EMAIL_DOMAIN = '8Dom.ai-n.Ze';
    const VALID_EMAIL = VALID_EMAIL_PREFIX + '@' + VALID_EMAIL_DOMAIN;

    it('should return null if the control value is empty', () => {
        const control = {
            value: ''
        };
        expect(emailValidator(control as FormControl)).toBeNull();
    });

    it('should return null on valid email', () => {
        const control = {
            value: VALID_EMAIL
        };
        expect(emailValidator(control as FormControl)).toBeNull();
    });

    it(`should return email error if email doesn't start with a letter`, () => {
        const control = {
            value: '0' + VALID_EMAIL
        };
        // expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);

        control.value = '.' + VALID_EMAIL;
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);

        control.value = '-' + VALID_EMAIL;
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);

        control.value = '_' + VALID_EMAIL;
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);
    });

    it(`should return email error if email doesn't have "@" symbol`, () => {
        const control = {
            value: VALID_EMAIL_PREFIX + VALID_EMAIL_DOMAIN
        };
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);
    });

    it(`should return email error if email doesn't have "." in domain`, () => {
        const control = {
            value: VALID_EMAIL_PREFIX + '@thingcom'
        };
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);
    });

    it(`should return email error if email domain TLD is less than 2 characters`, () => {
        const control = {
            value: VALID_EMAIL_PREFIX + '@thing.'
        };
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);

        control.value = VALID_EMAIL_PREFIX + '@thing.c';
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);

        control.value = VALID_EMAIL_PREFIX + '@thing.co';
        expect(emailValidator(control as FormControl)).toBeNull();
    });

    it(`should return email error if email domain TLD is greater than 4 characters`, () => {
        const control = {
            value: VALID_EMAIL_PREFIX + '@thing.comm'
        };
        expect(emailValidator(control as FormControl)).toBeNull();

        control.value += 'a';
        expect(emailValidator(control as FormControl)).toEqual(EMAIL_ERROR);
    });
});
