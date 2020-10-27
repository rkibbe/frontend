import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import {  Lead, Sni } from '@app/store/models/lead.model';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { NavigationService } from '@services/navigation.service';
import { AddSNIAction } from '@app/store/actions/lead.actions';
import { MatDialog } from '@angular/material';
import { DriverIconService } from '@services/driver-icon.service';
import { SpouseDPAlertModalComponent } from '@shared/spouse-dp-alert-modal/spouse-dp-alert-modal.component';

import { AppSettingsService } from '@services/app-settings.service';
import { AppSettings } from '@shared/settings/app-settings';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';
@Component({
    selector: 'verti-driver-summary',
    templateUrl: './driver-summary.component.html',
    styleUrls: ['./driver-summary.component.scss']
})
export class DriverSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
    imgSource: string;
    title: string;
    driverData: any;
    numberOfDrivers: number;
    maxDriverLimit: boolean;
    driverObservable$: any;
    driverCount$: any;
    includedDrivers$: any;
    leadSub: Subscription;
    loaderStopped: any;
    leadID: string;
    leadIdSubscription: Subscription;
    numberOfIncludedDrivers: number;
    sni: Sni;
    appSettings: AppSettings;
    contactNumber: string;
    private ngDestroy$ = new Subject();
    constructor(
        private store: Store<any>,
        private navService: NavigationService,
        private dialog: MatDialog,
        private driverIconService: DriverIconService,
        private appSettingService: AppSettingsService
    ) {
        this.title = 'Driver Summary';
        this.numberOfDrivers = 0;
        this.store.dispatch(new LeadActions.DeleteIncompleteDriver());
        this.maxDriverLimit = false;
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    ngOnInit() {
        this.getDriverCount();
        this.getIncludedDriverCount();
        this.getDriversDetails();
        this.leadIdSubscription = this.store
            .select(fromStore.leadID)
            .pipe(take(1))
            .subscribe(leadID => (this.leadID = leadID));
        this.store.select(fromStore.sni).subscribe(sni => (this.sni = sni));
        this.navService.upDateMarketingData();
        this.contactNumber = VERTI_CONTACT_NUMBERS.DEFAULT;
    }
    ngAfterViewInit() {}
    getDriversDetails() {
        this.driverObservable$ = this.store
            .select(fromStore.drivers)
            .pipe(distinctUntilChanged())
            .subscribe(drivers => {
                if (drivers.length) {
                    this.driverData = drivers.filter(driver => driver.isVisible);
                    if (this.driverData.length) {
                        this.customizeDriverData();
                    }
                }
            });
    }
    customizeDriverData() {
        this.driverData = this.driverData.map(driver => {
            return {
                ...driver,
                // age: this.calcAge(driver),
                genderImg: `assets/img/${this.driverIconService.getDriverImageName(driver)}.svg`,
                // genderCode: (driver.genderCode === 'M') ? 'male' : 'female'
                genderCode: driver.genderCode === 'M' ? 'male' : driver.genderCode === 'F' ? 'female' : ''
            };
        });
    }
    getDriverCount() {
        this.driverCount$ = this.store.select(fromStore.driverCount).subscribe(driverCount => {
            if (driverCount) {
                this.numberOfDrivers = driverCount;
            }
        });
    }
    getIncludedDriverCount() {
        this.includedDrivers$ = this.store.select(fromStore.includedDrivers).subscribe(driverCount => {
            this.numberOfIncludedDrivers = driverCount.length;
            this.maxDriverLimit = driverCount.length >= 5;
        });
    }
    calcAge(obj) {
        if (obj.age) {
            return obj.age;
        } else if (obj.dateOfBirth) {
            const dateOfBirth: any = obj.dateOfBirth.year + '-' + obj.dateOfBirth.month + '-' + obj.dateOfBirth.day;
            const dob: any = new Date(dateOfBirth);
            const ageDiff = Math.abs(Date.now() - dob);
            return Math.floor(ageDiff / (1000 * 3600 * 24) / 365);
        }
    }

    trackByFn(index: number, element: any) {
        return element ? element.driverID : null;
    }

    saveDetails() {
        this.loaderStopped = false;
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                if (leadData && (leadData.maritalStatusCode === 'M' || leadData.maritalStatusCode === 'C')) {
                    if (!this.getNonPNIIncludedDrivers(leadData).length) {
                        this.dialog.open(SpouseDPAlertModalComponent, {
                            data: leadData.maritalStatusCode,
                            panelClass: 'spouse-dp-alert'
                        });
                    } else {
                        this.saveAndNavigate();
                    }
                } else {
                    this.saveAndNavigate();
                }
            });
    }
    getNonPNIIncludedDrivers(leadData) {
        return leadData.quickQuote.drivers.filter(driver => !driver.isPNI && driver.isIncluded);
    }
    saveAndNavigate() {
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }
    addDriver() {
        const driver = {
            driverID: this.leadID + '-' + (this.numberOfDrivers + 1).toString(),
            isIncluded: false,
            isADPF: false,
            isAlreadyIncluded: false
        };
        this.store.dispatch(new LeadActions.AddDriver(driver));
        this.navService.navigateToSubRoute(driver.driverID);
    }
    editDriver(e, driver) {
        e.stopPropagation();
        const driverID = driver.driverID;
        this.navService.navigateToSubRoute(driverID);
    }
    addDriverBack(driver) {
        if (!driver.isAlreadyIncluded) {
            const driverID = driver.driverID;
            this.navService.navigateToSubRoute(driverID);
        } else {
            let pniNameObj = {};
            pniNameObj = {
                driverID: driver.driverID,
                isIncluded: true
            };
            if (driver.publicID) {
                pniNameObj = { ...pniNameObj, isQuoteDriver: true };
            }
            this.store.dispatch(new LeadActions.UpdateDriver(pniNameObj));
        }
    }
    removeDriver(driverID) {
        const pniNameObj = {
            driverID: driverID,
            isIncluded: false,
            ...{ isQuoteDriver: false }
        };
        if (this.sni && this.sni.isSNISelected && this.sni.driverID === driverID) {
            const sniContact: Sni = {
                driverID: null,
                email: null,
                phone: null,
                isSNISelected: false
            };
            this.store.dispatch(new AddSNIAction({ secondaryInsured: sniContact }));
        }
        this.store.dispatch(new LeadActions.UpdateDriver(pniNameObj));
    }
    splitPublicId(id) {
        id = id.split(':');
        return id[1].trim();
    }

    ngOnDestroy() {
        if (this.driverObservable$) {
            this.driverObservable$.unsubscribe();
        }
        if (this.driverCount$) {
            this.driverCount$.unsubscribe();
        }
        if (this.includedDrivers$) {
            this.includedDrivers$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }

        if (this.leadIdSubscription) {
            this.leadIdSubscription.unsubscribe();
        }
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }

    isClickable(driver) {
        return !(driver.isPNI || (!driver.isIncluded && this.maxDriverLimit));
    }

    handleClick(driver) {
        if (driver.isIncluded) {
            this.removeDriver(driver.driverID);
        } else {
            this.addDriverBack(driver);
        }
    }
}
