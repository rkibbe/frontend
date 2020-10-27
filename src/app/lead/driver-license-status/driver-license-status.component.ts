import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';
import { skip } from 'rxjs/operators';
@Component({
    selector: 'verti-driver-license-status',
    templateUrl: './driver-license-status.component.html'
})
export class DriverLicenseStatusComponent implements OnInit, OnDestroy {
    licenseStatusForm: FormGroup;
    title: string;
    licenseStatusForm$: Subscription;
    imgSource: string;
    eligibilityAnswers: any;
    driverId: string;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private store: Store<any>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private dataLayerService: DataLayerService
    ) {
        this.imgSource = './assets/img/Icon_driverlicense.svg';
    }

    ngOnInit() {
        this.licenseStatusForm = this.fb.group({
            licenseRevoked: ['', Validators.required]
        });

        this.activatedRoute.paramMap.subscribe(params => {
            this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
                const selectedDriver = drivers[0];
                if (selectedDriver) {
                    this.driverId = selectedDriver['driverID'];
                    this.title = `Is ${selectedDriver.firstName}'s driver’s license suspended/revoked currently or
          has it been in the last 5 years?`;
                    this.licenseStatusForm.patchValue(selectedDriver);
                }
            });
        });
        this.navService.upDateMarketingData();
    }
    saveDetails() {
        const driverObj = this.licenseStatusForm.value;
        driverObj.driverID = this.driverId;
        if (this.navService.isLastVisibleChildRoute()) {
            driverObj.isIncluded = true;
            driverObj.isAlreadyIncluded = true;
            driverObj.isVisible = true;
        }
        this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
        this.navService.navigateSubRouteToSubRoute();
    }

    ngOnDestroy() {
        if (this.licenseStatusForm$) {
            this.licenseStatusForm$.unsubscribe();
        }
    }
}
