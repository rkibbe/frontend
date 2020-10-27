import { FormControl, ValidatorFn } from '@angular/forms';
import { PhoneFormatter } from '../formatters/phone-formatter';

export function phoneValidator(formatter: PhoneFormatter): ValidatorFn {
    return (control: FormControl) => {
        if (control.value) {
            const stripped = formatter.removeUnimportantChars(control.value);
            if (
                formatter.format(control.value) !== control.value ||
                stripped.length < 10 ||
                stripped.charAt(0) === '0' ||
                stripped.charAt(0) === '1'
            ) {
                return { phone: true };
            }
        }

        return null;
    };
}
