import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Address } from '@app/store/models/lead.model';
import { environment } from '@env/environment';
import { TrilliumModalComponent, TrilliumModalData } from '@shared/trillium-modal/trillium-modal.component';
import { Observable, of, Subscriber } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TrilliumAddressService {
    readonly URL = `${environment.nodeserver}address`;

    constructor(private http: HttpClient, private dialog: MatDialog) { }

    private sendTrilliumPutRequest(address: Address): Observable<TrilliumResponse> {
        return this.http
            .put<any>(this.URL, this.mapAddressToRequestObj(address))
            .pipe(map(this.mapPutResponseToAddressInterface.bind(this)));
    }

    public verifyAddress(userAddress: Address | Observable<Address>): Observable<Address> {
        const obs = userAddress instanceof Observable ? userAddress : of(userAddress);

        return obs.pipe(
            switchMap(
                address =>
                    new Observable<Address>(observer => {
                        this.sendTrilliumPutRequest(address).subscribe(
                            (trillRes: TrilliumResponse) => {
                                if (trillRes) {
                                    if (this.isInvalidAddress(trillRes, address)) {
                                        this.getUpdatedAddressFromModal(observer, trillRes.address, address, true);
                                    } else if (this.isValidAddress(trillRes, address)) {
                                        observer.next({
                                            ...address,
                                            isAddressVerified: true
                                        });
                                        observer.complete();
                                    } else if (this.isPartialAddress(trillRes, address)) {
                                        this.getUpdatedAddressFromModal(observer, trillRes.address, address, false);
                                    } else {
                                        // TODO handle case
                                        observer.error({ error: 'Unhandled trillium address case' });
                                    }
                                } else {
                                    observer.next({
                                        ...address,
                                        isAddressVerified: false
                                    });
                                    observer.complete();
                                }
                            },
                            err => {
                                console.error('Unable to verify address with trillium');
                                observer.next({
                                    ...address,
                                    isAddressVerified: false
                                });
                                observer.complete();
                            }
                        );
                    })
            )
        );
    }

    private mapAddressToRequestObj(address: Address): TrilliumRequestObject {
        return {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            zip: address.postalCode
        };
    }

    private mapPutResponseToAddressInterface(res: any): TrilliumResponse {
        if (res && res.apiOutput && res.apiOutput.address) {
            const resAddr = res.apiOutput.address;
            const address: Address = {
                addressLine1: resAddr.address,
                addressLine2: resAddr.subBuildingValue ? null : resAddr.address2,
                city: resAddr.cityName,
                state: resAddr.regionName,
                postalCode: resAddr.postalCode.split('-')[0].trim(),
                county: resAddr.county,
                country: 'US'
            };

            delete resAddr.address;
            delete resAddr.address2;
            delete resAddr.cityName;
            delete resAddr.regionName;
            delete resAddr.postalCode;
            delete resAddr.county;
            delete resAddr.country;

            return {
                ...resAddr,
                address
            };
        }
        return null;
    }

    private getUpdatedAddressFromModal(
        observer: Subscriber<Address>,
        trillAddress: Address,
        userAddress: Address,
        isInvalid: boolean
    ): void {
        const data: TrilliumModalData = {
            uspsSuggestion: trillAddress,
            userEntered: userAddress,
            invalidAddress: isInvalid ? true : undefined,
            partialAddress: isInvalid ? undefined : true
        };

        this.dialog
            .open(TrilliumModalComponent, {
                data: data,
                panelClass: 'custom-trillium-modal'
            })
            .afterClosed()
            .subscribe(shouldUpdateAddress => {
                if (typeof shouldUpdateAddress !== 'undefined') {
                    if (shouldUpdateAddress) {
                        trillAddress.city = trillAddress.city.toUpperCase();
                    }
                    observer.next({
                        ...(shouldUpdateAddress ? trillAddress : userAddress),
                        isAddressVerified: shouldUpdateAddress
                    });
                }
                observer.complete();
            });
    }

    // Address validation
    private isInvalidAddress(trillRes: TrilliumResponse, address: Address): boolean {
        return (
            !trillRes.address.addressLine1 || this.invalidAddrCase1(trillRes) ||
            this.invalidAddrCase2(trillRes) ||
            this.invalidAddrCase3(trillRes, address)
        );
    }

    private invalidAddrCase1(trillRes: TrilliumResponse): boolean {
        return (
            trillRes.matchLevel !== '0' ||
            (trillRes.matchLevel === '0' &&
                trillRes.dpvConfirm !== null &&
                trillRes.dpvConfirm !== 'Y' &&
                trillRes.dpvConfirm !== 'S' &&
                trillRes.dpvConfirm !== 'D')
        );
    }

    private invalidAddrCase2(trillRes: TrilliumResponse): boolean {
        return (
            trillRes.matchLevel === '0' &&
            trillRes.rdiFlag !== null &&
            trillRes.rdiFlag !== '' &&
            trillRes.rdiFlag !== 'Y'
        );
    }

    private invalidAddrCase3(trillRes: TrilliumResponse, address: Address): boolean {
        return (
            trillRes.matchLevel === '0' &&
            (this.searchText(trillRes.address.addressLine1, address.addressLine1) &&
                trillRes.address.postalCode !== address.postalCode)
        );
    }

    private isPartialAddress(trillRes: TrilliumResponse, address: Address): boolean {
        return this.partialAddrCase1(trillRes, address) || this.partialAddrCase2(trillRes, address);
    }

    private partialAddrCase1(trillRes: TrilliumResponse, address: Address): boolean {
        return (
            trillRes.matchLevel === '0' &&
            (this.searchText(trillRes.address.addressLine1, address.addressLine1) ||
                trillRes.address.postalCode !== address.postalCode)
        );
    }

    private partialAddrCase2(trillRes: TrilliumResponse, address: Address): boolean {
        return (
            trillRes.matchLevel === '0' &&
            (this.searchText(trillRes.address.addressLine1, address.addressLine1) ||
                trillRes.address.postalCode === address.postalCode)
        );
    }

    private isValidAddress(trillRes: TrilliumResponse, address: Address): boolean {
        return (
            trillRes.matchLevel === '0' &&
            (trillRes.address.addressLine1.toLowerCase() === address.addressLine1.toLowerCase() &&
                trillRes.address.postalCode === address.postalCode)
        );
    }

    private searchText(fullStr: string, subStr: string): boolean {
        return fullStr.toLowerCase().search(subStr.toLowerCase()) !== -1;
    }
}

interface TrilliumResponse {
    matchLevel: string;
    dpvConfirm: string;
    rdiFlag: string;
    address: Address;
}

interface TrilliumRequestObject {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
}

export interface TrilliumVerificationObject {
    isAddressVerified: boolean;
    updatedAddress?: Address;
}
