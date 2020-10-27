import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { map, retry, tap, take, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Driver } from 'src/app/store/models/lead.model';
@Injectable()
export class LicenseNumberValidationService implements OnDestroy {
    readonly URL = environment.nodeserver + 'driver/license';

    readonly SUCCESS = 'SUCCESS';
    readonly FAILURE = 'FAILURE';

    readonly MAX_CACHE = 10;

    cache: CachedItem[] = new Array(this.MAX_CACHE);
    cacheIndex = 0;
    includedDrivers: Driver[];
    currDriverId: string;
    private ngDestroy$ = new Subject();
    constructor(private httpClient: HttpClient, private store: Store<any>) {
        this.store
            .select(fromStore.includedDrivers).pipe(takeUntil(this.ngDestroy$)).subscribe(drivers => this.includedDrivers = drivers);
    }

    validateLicenseNumber(stateCode: string, licenseNumber: string, currentDriverId: string): Observable<any> {
        this.currDriverId = currentDriverId;
        const cached = this.cache.find(
            item => item && item.id.stateCode === stateCode && item.id.licenseNumber === licenseNumber
        );

        if (cached !== undefined) {
            if (!cached.value && this.isDuplicateLicenseNumber(licenseNumber)) {
                return of({ licenseNumberDuplicate: 'License number already used' });
            }
            return of(cached.value);
        }

        const params = new HttpParams().set('licenseNumber', licenseNumber).set('stateCode', stateCode);

        return this.httpClient.get<any>(this.URL, { params }).pipe(
            retry(1),
            map(this.mapResponseToErrorObj.bind(this)),
            tap((result: LicenseNumError) => this.cacheResult(stateCode, licenseNumber, result))
        );
    }

    private mapResponseToErrorObj(res: any): LicenseNumError {
        if (res && res.apiOutput && res.apiOutput.result) {
            const result = res.apiOutput.result;
            if (result.status === this.SUCCESS) {
                if (this.isDuplicateLicenseNumber(result.licenseNumber)) {
                    return { licenseNumberDuplicate: 'License number already used' };
                }
                return null;
            }

            const licenseNumberErr = {
                message: res.apiOutput.result.validFormat || ''
            };

            return { licenseNumber: licenseNumberErr };
        }

        return null;
    }

    private cacheResult(stateCode: string, licenseNumber: string, value: LicenseNumError): void {
        this.cache[this.cacheIndex] = { id: { stateCode, licenseNumber }, value };
        this.cacheIndex = (this.cacheIndex + 1) % this.MAX_CACHE;
    }
    isDuplicateLicenseNumber(licenseNumber) {
        return this.includedDrivers.filter(drv => drv.licenseNumber === licenseNumber && drv.driverID !== this.currDriverId).length;
    }
    ngOnDestroy(): void {
        this.ngDestroy$.complete();
        this.ngDestroy$.next();
    }
}

interface LicenseNumError {
    readonly licenseNumber?: { readonly message: string };
    readonly licenseNumberDuplicate?: string;
}

interface CachedItem {
    readonly id: {
        readonly stateCode: string;
        readonly licenseNumber: string;
    };
    readonly value: LicenseNumError;
}
