import { FormControl } from '@angular/forms';
import { Address } from '@app/store/models/lead.model';

export function addressInterfaceValidator(control: FormControl): { addressInterface: boolean } {
    const test = control.value;

    if (!test || typeof test !== 'object') {
        return { addressInterface: true };
    }

    const expectedAddress: Array<keyof Address> = ['addressLine1', 'city', 'state'];

    for (const key of expectedAddress) {
        if (!(typeof test[key] === 'string' && test[key].trim())) {
            return { addressInterface: true };
        }
    }

    return null;
}
