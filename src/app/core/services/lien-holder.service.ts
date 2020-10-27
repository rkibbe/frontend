import { Injectable, OnDestroy } from '@angular/core';
import { LienHolder } from '@app/store/models/lead.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { retry, tap, map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LienHolderService implements OnDestroy {
    readonly URL = environment.nodeserver + 'products/lienHolderList';
    readonly RESOURCE_TIMEOUT = 1000 * 60 * 10;

    lienHolders: LienHolder[] = [];

    resourceTimer: NodeJS.Timer;

    constructor(private httpClient: HttpClient) {}

    getLienHolders(): Observable<LienHolder[]> {
        if (this.lienHolders.length) {
            this.resetResourceRelease();
            return of(this.lienHolders.slice());
        }

        return this.httpClient.get<LienHolderResponse>(this.URL).pipe(
            retry(3),
            map(res => {
                if (res && res.ApiOutput && res.ApiOutput.lienHolders) {
                    return this.mapUnparsedLienHolderToLienHolder(res.ApiOutput.lienHolders);
                }
                return [];
            }),
            tap(lienHolders => {
                this.lienHolders = lienHolders.slice();
                this.resetResourceRelease();
            }),
            catchError(() => of([]))
        );
    }

    private mapUnparsedLienHolderToLienHolder(lienHolders: UnparsedLienHolder[]): LienHolder[] {
        return lienHolders.map(lienHolder => ({
            name: lienHolder.name,
            address:
                lienHolder.addressLine1 && lienHolder.city && lienHolder.state && lienHolder.postCode
                    ? {
                          addressLine1: lienHolder.addressLine1 || '',
                          addressLine2: lienHolder.addressLine2 || '',
                          city: lienHolder.city || '',
                          state: lienHolder.state || '',
                          postalCode: lienHolder.postCode || '',
                          country: 'US'
                      }
                    : null
        }));
    }

    resetResourceRelease() {
        if (this.resourceTimer) {
            clearTimeout(this.resourceTimer);
        }

        this.resourceTimer = setTimeout(() => (this.lienHolders = []), this.RESOURCE_TIMEOUT);
    }

    ngOnDestroy(): void {
        if (this.resourceTimer) {
            clearTimeout(this.resourceTimer);
        }
    }
}

interface LienHolderResponse {
    ApiOutput: { lienHolders: UnparsedLienHolder[] };
}

interface UnparsedLienHolder {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postCode: string;
}
