import { Component, OnInit, HostBinding } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Store } from '@ngrx/store';
import { Lead, PeriodStartDate } from '@app/store/models/lead.model';
import { distinctUntilChanged } from 'rxjs/operators';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from '@services/app-settings.service';
import { DriverIconService } from '@services/driver-icon.service';

import { MatDialog } from '@angular/material';
import { NavigationService } from '@services/navigation.service';
import { WalmericDialogModalComponent } from '../../core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'verti-review-all-details-modal',
    templateUrl: './review-all-details-modal.component.html',
    styleUrls: ['./review-all-details-modal.component.scss']
})
export class ReviewAllDetailsModalComponent implements OnInit {
    @HostBinding('class.verti-review-all-details-modal') mainClass = true;

    reviewDetailsObservable$: any;
    reviewDetailsData: any;
    noOfAccidentsAndViolations: {};

    leadData$: Subscription;
    leadData: any;
    vehicleData: any;
    driverList: any[];
    maleDrivers: any[];
    femaleDrivers: any[];
    appSettings: AppSettings;
    policyStartDate: PeriodStartDate;
    policyDate: string;

    constructor(
        private store: Store<any>,
        public dialogRef: MatDialogRef<ReviewAllDetailsModalComponent>,
        // @Inject(MAT_DIALOG_DATA) public titleHolderType: TitleHolder
        private driverIconService: DriverIconService,
        private appSettingService: AppSettingsService,
        public dialog: MatDialog,
        private navService: NavigationService
    ) {
        this.dialogRef.disableClose = true;
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    ngOnInit() {
        this.leadData$ = this.store
            .select(fromStore.leadSelector)
            .pipe(distinctUntilChanged())
            .subscribe((leadData: Lead) => {
                this.leadData = leadData;
                this.vehicleData = leadData.quickQuote.vehicles.map(vehicle => {
                    return {
                        ...vehicle,
                        iconExisted: this.checkBodyStyleCode(vehicle.bodyStyleCode)
                    };
                });
                const driverData = leadData.quickQuote.drivers;
                if (driverData.length) {
                    this.maleDrivers = driverData.filter(driver => driver.genderCode === 'M');
                    this.femaleDrivers = driverData.filter(driver => driver.genderCode === 'F');
                    this.driverList = leadData.quickQuote.drivers.map(driver => {
                        return {
                            ...driver,
                            genderImg: `assets/img/${this.driverIconService.getDriverImageName(driver)}.svg`
                        };
                    });
                }
                this.policyStartDate = leadData.quickQuote.periodStartDate;
                if (this.policyStartDate.year && this.policyStartDate.month && this.policyStartDate.day) {
                    this.policyDate =
                        this.policyStartDate.month + '/' + this.policyStartDate.day + '/' + this.policyStartDate.year;
                }
            });
        this.navService.upDateMarketingData();
    }

    checkBodyStyleCode(bodyStyleCode) {
        if (bodyStyleCode) {
            return this.appSettings.VEHICLE_BODY_STYLES.includes(bodyStyleCode.trim());
        }
    }

    minimizeCoverage(minimize) {
        this.dialogRef.close(minimize);
    }
    openWalmericModal() {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }

    onCloseClick() {
        this.dialogRef.close(false);
    }
}
