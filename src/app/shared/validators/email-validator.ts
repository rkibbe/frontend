import { FormControl } from '@angular/forms';

const emailPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/;

export function emailValidator(control: FormControl) {
    return control.value && !emailPattern.test(control.value) ? { email: true } : null;
}

