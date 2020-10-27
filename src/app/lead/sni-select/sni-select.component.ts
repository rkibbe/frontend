import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddSNIAction } from '@app/store/actions/lead.actions';
import { Driver, Sni } from '@app/store/models/lead.model';
import * as storeSelectors from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-sni-select',
    templateUrl: './sni-select.component.html',
    styleUrls: ['./sni-select.component.scss']
})
export class SniSelectComponent implements OnInit, OnDestroy {
    readonly NEGATIVE_RESPONSE = '-1';

    drivers: Array<Driver>;
    drivers$: Subscription;

    hasDispatched = false; // TODO delete after dummy data isn't needed
    sniForm: FormGroup;
    constructor(private store: Store<any>, private navService: NavigationService, private fb: FormBuilder) {
        this.drivers$ = this.store.select(storeSelectors.includedDrivers).subscribe(drivers => {
            this.drivers = (drivers && drivers.filter(d => !d.isPNI && d.licenseStatus === 'ValidLicense')) || [];
        });
        this.sniForm = this.fb.group({
            driverID: ['']
        });
    }

    ngOnInit() {
        this.store
            .select(storeSelectors.sni)
            .pipe(take(1))
            .subscribe(sni => {
                let sniData = sni;
                if (sniData) {
                    if (sniData.isSNISelected === false) {
                        sniData = { ...sniData, driverID: this.NEGATIVE_RESPONSE };
                    }
                    this.sniForm.patchValue(sniData);
                }
            });
        this.navService.upDateMarketingData();
    }

    ngOnDestroy() {
        if (this.drivers$ && !this.drivers$.closed) {
            this.drivers$.unsubscribe();
        }
    }

    onButtonToggleClick(driverId) {
        if (driverId === this.NEGATIVE_RESPONSE) {
            // reset/remove SNI
            const sniContact: Sni = {
                driverID: null,
                email: null,
                phone: null,
                isSNISelected: false
            };
            this.store.dispatch(new AddSNIAction({ secondaryInsured: sniContact }));

            // TODO deal with negative response
            this.navService.navigate();
        } else {
            this.navService.gotoRouteByName('snicontact/' + driverId);
        }
    }
}
