import { FormControl } from '@angular/forms';

export function objectTypeValidtaor(control: FormControl): { object: boolean } {
    return typeof control.value === 'object' ? null : { object: true };
}
