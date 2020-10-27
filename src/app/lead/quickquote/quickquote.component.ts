import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { DataLayerService } from '@services/data-layer.service';
import { DriverIconService } from '@services/driver-icon.service';
import { NavigationService } from '@services/navigation.service';
import { AppSettings } from '@shared/settings/app-settings';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'verti-quickquote',
    templateUrl: './quickquote.component.html',
    styleUrls: ['./quickquote.component.scss'],
    animations: [
        trigger('fade', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [animate(300)]),
            transition(':leave', [animate(500)])
        ])
    ]
})
export class QuickquoteComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class.verti-quickquote') mainClass = true;

    stickyHeader: boolean;
    leadData$: any;
    leadData: Lead;
    isADPFQuote: boolean;
    premiumPrice: string;
    vehicleData: any;
    stickyPosition: any;
    driverList: any[];
    maleDrivers: any[];
    femaleDrivers: any[];
    appSettings: AppSettings;
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    private ngDestroy$ = new Subject();


    constructor(
        @Inject(DOCUMENT) document,
        private store: Store<any>,
        private router: Router,
        private navService: NavigationService,
        private dataLayerService: DataLayerService,
        private appSettingService: AppSettingsService,
        private driverIconService: DriverIconService
    ) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    @ViewChild('stickyHead') stickyHead: ElementRef;

    ngOnInit() {
        this.navService.upDateMarketingData();
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
            });
        this.premiumPrice = this.leadData.quickQuote.monthlyPremiumPrice || '';
    }

    ngAfterViewInit() {
        this.stickyPosition = this.stickyHead.nativeElement.offsetTop;
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(e) {
        const element = document.getElementById('normalHeader');
        if (window.scrollY >= this.stickyPosition + 160) {
            element.classList.add('normal-header-invisable');
            this.stickyHeader = true;
        } else {
            element.classList.remove('normal-header-invisable');
            this.stickyHeader = false;
        }
    }

    checkBodyStyleCode(bodyStyleCode) {
        if (bodyStyleCode) {
            return this.appSettings.VEHICLE_BODY_STYLES.includes(bodyStyleCode.trim());
        }
    }

    doContinue() {
        this.loaderStopped = false;
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy() {
        if (this.leadData$) {
            this.leadData$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
