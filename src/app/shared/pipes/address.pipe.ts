import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '@app/store/models/lead.model';

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {
    transform(address: Address): string {
        return address && typeof address === 'object' ? this.buildAddressString(address) : (address as any);
    }

    private buildAddressString(address: Address): string {
        const addr1 = address.addressLine1 || '';
        const addr2 = address.addressLine2 ? ' ' + address.addressLine2 : '';
        const city = address.city ? ', ' + address.city : '';
        const state = address.state ? ', ' + address.state : '';
        const postCode = address.postalCode ? ', ' + address.postalCode : '';

        return addr1 + addr2 + city + state + postCode;
    }
}
