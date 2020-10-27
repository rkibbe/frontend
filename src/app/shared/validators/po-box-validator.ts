import { FormControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Address } from '@app/store/models/lead.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const poBoxRegex: RegExp = /p[.\s]*o[.\s]*box/i;

/**
 * Generates a validator for an address that verifies it's not a PO box address.
 * If a function is provided, then that function will be called in place of getting
 * the value directly from the bound control. If no function is provided, then
 * the value from the bound control will be used. It will expect the value to either be
 * a string, or implement the 'Address' interface and will build a string from that
 *
 * Will run the test if:
 *      -addressSimplifier is provided
 *      -control value is string or object that implements Address interface
 * else null is returned
 *
 * @param addressSimplifier function to get string version of address
 */
export function poBoxValidator(addressSimplifier?: () => string): ValidatorFn {
    return (control: FormControl): POBoxValidationError => {
        if (addressSimplifier) {
            return testAddressString(addressSimplifier());
        }

        return getErrorObjFromControlValue(control.value);
    };
}

/**
 * See 'poBoxValidator' but works with Observable<Address> instead of Address
 *
 * Will run the test if:
 *      -addressSimplifier is provided
 *      -control value is a Observable<string> or Observable<Address>
 * else null is returned
 *
 * @param addressSimplifier function to get string version of address
 */
export function poBoxValidatorAsync(addressSimplifier?: () => Observable<string>): AsyncValidatorFn {
    return (control: FormControl): Observable<POBoxValidationError> => {
        if (addressSimplifier) {
            return addressSimplifier().pipe(map(addrStr => testAddressString(addrStr)));
        }

        const addrObs: Observable<string | Address> = control.value;
        return (
            (addrObs &&
                typeof addrObs === 'object' &&
                addrObs instanceof Observable &&
                addrObs.pipe(map(address => getErrorObjFromControlValue(address)))) ||
            of(null)
        );
    };
}

function getErrorObjFromControlValue(address: Address | string): POBoxValidationError {
    const addrStr =
        (address && typeof address === 'object' && buildSimpleAddressString(address)) ||
        (typeof address === 'string' && address) ||
        '';
    return addrStr ? testAddressString(addrStr) : null;
}

function buildSimpleAddressString(address: Address): string {
    return ((address.addressLine1 || '') + ' ' + (address.addressLine2 || '')).trim();
}

function testAddressString(address: string): POBoxValidationError {
    return address && poBoxRegex.test(address) ? { poBox: true } : null;
}

export interface POBoxValidationError {
    poBox: boolean;
}
