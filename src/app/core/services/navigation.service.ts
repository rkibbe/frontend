import { Injectable } from '@angular/core';
import { Subscription, Observable, MonoTypeOperatorFunction, throwError, EMPTY, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { skip, take, retryWhen, catchError, mergeMap, switchMap, first, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged } from 'rxjs/operators';
import * as LeadActions from '@app/store/actions/lead.actions';
import { MatDialog } from '@angular/material';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { Driver, Vehicle, Lead, LicenseStatus, TitleHolder } from '@app/store/models/lead.model';
import { v4 as uuid } from 'uuid';
import { StopLoaderAction } from '@app/store/actions/loader.actions';
import { SetErrorAction } from '@app/store/actions/error.actions';
import { AppSettingsService } from './app-settings.service';
import { AppSettings } from '@shared/settings/app-settings';
import { OpportunityModalComponent } from '@shared/opportunity-modal/opportunity-modal.component';
const CUSTOMTIMEOUTMODAL = 'custom-timeout-modal';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    routeStoreSubscription: Subscription;
    visibleRoutes = [];
    routeChangeSubscription: Subscription;
    currentRoute: string;
    lived2months: boolean;
    loaderSubscription: Subscription;
    loaderStopped: boolean;
    errorSubscription: Subscription;
    errorOccured: boolean;
    count: number;
    visibleCurrentSubRoutes = [];
    routeParam: any;
    currentParentRouteIndex: number;
    currentRouteIndex: number;
    isADPFQuote: boolean;
    quoteNumber: string;
    currentRouteObj: any;
    monthlyPremiumPrice: string;
    numOfTimesErrorOccurredOnScreen: number;
    sni: any;
    driversValidLicense: Driver[];
    drsWithVldLcnsAndHasOwnLcns: Driver[];
    nonPNIIncludedDrivers: Driver[];
    includedDrivers: Driver[];
    rootBackHandler: BackHandler;
    isSNI: boolean;
    nonAdpfIncludedVehicles: Vehicle[];
    skipPageCount: number;
    pniDriver: Driver;
    premiumChangeIndicator: number;
    appSettings: AppSettings;
    includedVehicles: Vehicle[];
    leasedLoanVehicles: Vehicle[];
    stubbedVinVehicles: Vehicle[];
    hasPhoneNumber: boolean;
    phoneSetOnPhonePage: boolean;
    requiredVerificationDocuments: boolean;
    landingRoute: string;
    previousAddressIndex: number;
    sniIndex: number;
    vinIndex: number;
    preRcVinIndex: number;
    postRcVinIndex: number;
    relationshipIndex: number;
    licenseIndex: number;
    sniContactIndex: number;
    titleHolderSelectIndex: number;
    titleHolderContactIndex: number;
    phoneIndex: number;
    priceChangeIndex: number;
    docVerifyIndex: number;
    uploadDocIndex: number;
    billingAddIndex: number;
    updatePayerInfoAddress: boolean;
    payIndex: number;
    paymentConfirmInd: number;
    paymentStatusInd: number;
    policyNumber: string;
    paymentCallBackCompleted: boolean;
    previousRoute: string;
    insuranceCoverageInd: number;
    licensePreRcIndex: number;
    licensePostRcIndex: number;
    redirectLead: boolean;
    redirectUrl: string;
    postLeadResult: string;
    leadLandingInd: number;
    addVehicleInd: number;
    adpfVehicles: Vehicle[];

    constructor(
        private store: Store<any>,
        private router: Router,
        private dialog: MatDialog,
        private appSettingService: AppSettingsService
    ) {
        this.currentRoute = '';
        this.lived2months = false;
        this.loaderStopped = false;
        this.isADPFQuote = false;
        this.quoteNumber = '';
        this.monthlyPremiumPrice = '0.00';
        this.numOfTimesErrorOccurredOnScreen = 0;
        this.isSNI = null;
        this.hasPhoneNumber = false;
        this.requiredVerificationDocuments = false;
        this.updatePayerInfoAddress = false;
        this.phoneSetOnPhonePage = false;
        this.premiumChangeIndicator = 0;
        this.paymentCallBackCompleted = false;
        this.previousRoute = '';
        this.redirectLead = false;
        this.redirectUrl = '';
        this.init();
        this.rootBackHandler = new BackHandler('', null, this.mainBackHandleFn.bind(this));
        this.appSettingService
            .getSettings()
            .pipe(take(1))
            .subscribe(settings => {
                this.appSettings = settings;
            });
    }

    init() {
        this.store
            .select(fromStore.leadSelector)
            .pipe(distinctUntilChanged())
            .subscribe((leadData: Lead) => {
                if (leadData && leadData.primaryAddress) {
                    this.lived2months = leadData.primaryAddress.timeAtCurrentResidenceCode !== 'lessThan2Months';
                }
                this.setPageSkipParams(leadData);
            });
    }

    setPhonePageFlag(flag: boolean): void {
        this.phoneSetOnPhonePage = flag;
    }

    setPageSkipParams(leadData: Lead) {
        const quickQuote = leadData.quickQuote;
        const quote = leadData.quote;
        this.hasPhoneNumber = !!leadData.phoneNumber;
        if (leadData && quickQuote.monthlyPremiumPrice) {
            this.monthlyPremiumPrice = quickQuote.monthlyPremiumPrice;
        }
        if (leadData && quickQuote.secondaryInsured) {
            this.isSNI = quickQuote.secondaryInsured.isSNISelected;
            this.sni = quickQuote.secondaryInsured;
        }
        this.getAllDriverTypeList(leadData, quickQuote);
        if (leadData && quote) {
            if (quote.verificationDocuments && quote.verificationDocuments.length) {
                this.requiredVerificationDocuments = true;
            } else {
                this.requiredVerificationDocuments = false;
            }
            if (quote.updatePayerInfoAddress) {
                this.updatePayerInfoAddress = true;
            } else {
                this.updatePayerInfoAddress = false;
            }
        }
        if (quickQuote) {
            this.getAllVehicleInfo(quickQuote);
        }
    }
    getAllVehicleInfo(quickQuote) {
        this.stubbedVinVehicles = quickQuote.vehicles.filter(vehicle => vehicle.isIncluded && vehicle.isStubbedVin);
        this.adpfVehicles = quickQuote.vehicles.filter(vehicle => vehicle.isADPF) || [];
    }
    isADPFVehicle(vehicleID) {
        return this.adpfVehicles.filter(vehicle => vehicle.vehicleID === vehicleID).length;
    }
    getAllDriverTypeList(leadData, quickQuote) {
        if (leadData && quickQuote) {
            this.driversValidLicense = quickQuote.drivers.filter(
                d => !d.isPNI && d.isIncluded && d.licenseStatus === LicenseStatus.ValidLicense
            );
            this.drsWithVldLcnsAndHasOwnLcns = quickQuote.drivers.filter(
                d =>
                    (d.isIncluded && d.licenseStatus === LicenseStatus.ValidLicense) ||
                    (d.licenseStatus === LicenseStatus.OwnInsurance && !d.ownInsuranceApprovedExt)
            );
            this.nonAdpfIncludedVehicles = quickQuote.vehicles.filter(vehicle => vehicle.isIncluded && !vehicle.isADPF);
            this.includedVehicles = quickQuote.vehicles.filter(vehicle => vehicle.isIncluded);
            this.leasedLoanVehicles = this.includedVehicles.filter(vehicle =>
                [TitleHolder.LEASE, TitleHolder.LOAN].includes(vehicle.titleHolder)
            );
            this.nonPNIIncludedDrivers = quickQuote.drivers.filter(driver => !driver.isPNI && driver.isIncluded);
            this.includedDrivers = this.getIncludedDrivers(quickQuote.drivers);
            this.pniDriver = this.getPniDriver(quickQuote.drivers);
        }
    }
    getIncludedDrivers(drivers) {
        return drivers.filter(driver => driver.isIncluded);
    }
    getPniDriver(drivers) {
        return drivers.filter(driver => driver.isPNI)[0];
    }
    saveLeadAndNavigate(routeName?: string): Subscription;
    saveLeadAndNavigate(takeNotifier: Observable<any>, routeName?: string): Subscription;

    saveLeadAndNavigate(paramOne: Observable<any> | string, paramTwo?: string): Subscription {
        const nextRoute = typeof paramOne === 'string' ? paramOne : paramTwo;
        let obs = this.store.select(fromStore.leadSelector).pipe(
            take(1),
            switchMap((leadData: Lead) => {
                this.store.dispatch(new LeadActions.PostLeadAction(leadData));
                return this.store.select(state => state.loader.isLoading).pipe(first(loading => !loading));
            })
        );

        if (typeof paramOne === 'object') {
            obs = obs.pipe(takeUntil(paramOne));
        }

        return obs.subscribe(_ => {
            this.currentRouteObj.preFill = true;
            if (nextRoute !== undefined) {
                this.gotoRouteByName(nextRoute);
            } else {
                this.navigate();
            }
        });
    }
    saveLeadAndGoToUrl(url: string, takeNotifier?: Observable<any>): Subscription {
        let obs = this.store.select(fromStore.leadSelector).pipe(
            take(1),
            switchMap((leadData: Lead) => {
                this.store.dispatch(new LeadActions.PostLeadAction(leadData));
                return this.store.select(state => state.loader.isLoading).pipe(first(loading => !loading));
            })
        );

        if (takeNotifier) {
            obs = obs.pipe(takeUntil(takeNotifier));
        }

        return obs.subscribe(_ => {
            this.currentRouteObj.preFill = true;
            this.gotoUrl(url);
        });
    }

    navigate(url?) {
        const nextRouteObj = this.getNextRoute();
        if (nextRouteObj) {
            this.processNavigation(nextRouteObj, url);
        } else {
            this.processNavigation('', url);
        }
    }
    // navigates to sub route from parent
    navigateToSubRoute(routeParam) {
        this.getPageIndexsForConditionalPages();
        this.currentParentRouteIndex = this.getCurrentRouteIndex();
        this.visibleCurrentSubRoutes = this.getVisibleSubRoutesByRoute(
            this.visibleRoutes[this.currentParentRouteIndex].routeName
        );
        this.routeParam = routeParam;
        // const nextRouteObj = this.visibleCurrentSubRoutes[0];
        // const childRouteInd = this.getCurrentSubRouteIndex();
        const nextRouteObj = this.skipChildRouteForward(0);
        const updatedRouteName = nextRouteObj.routeName.replace(/:id/gi, routeParam);
        const routeObj = { ...nextRouteObj, ...{ routeName: updatedRouteName } };
        this.processNavigation(routeObj);
    }

    // navigates to sub route from sub route
    navigateSubRouteToSubRoute() {
        this.getPageIndexsForConditionalPages();
        const nextRouteObj = this.getNextSubRoute();
        if (nextRouteObj) {
            const updatedRouteName = nextRouteObj.routeName.replace(/:id/gi, this.routeParam);
            const routeObj = { ...nextRouteObj, ...{ routeName: updatedRouteName } };
            this.processNavigation(routeObj);
        } else {
            const routeObj = this.getRouteByIndex(this.currentParentRouteIndex);
            this.processNavigation(routeObj);
        }
    }

    // returns next subroute object
    getNextSubRoute() {
        const currentSubRouteIndex = this.getCurrentSubRouteIndex();
        if (
            currentSubRouteIndex !== -1 &&
            currentSubRouteIndex !== undefined &&
            currentSubRouteIndex !== null &&
            currentSubRouteIndex < this.visibleCurrentSubRoutes.length - 1
        ) {
            return this.visibleCurrentSubRoutes[currentSubRouteIndex + 1];
        }
    }

    // returns subroute index
    getCurrentSubRouteIndex() {
        return this.visibleCurrentSubRoutes.findIndex(
            subRoute => subRoute.routeName === this.currentRouteObj.routeName
        );
    }

    getVisibleSubRoutesByRoute(parentRoute: string) {
        const currentRouteArrObj = this.visibleRoutes.filter(route => route.routeName === parentRoute);
        if (
            currentRouteArrObj.length &&
            currentRouteArrObj[0].childRoutes &&
            currentRouteArrObj[0].childRoutes.length
        ) {
            return currentRouteArrObj[0].childRoutes.filter(item => item.visible === true);
        }
        return [];
    }

    processNavigation(nextRouteObj, outsideUrl?) {
        this.errorOccured = false;
        this.count = 0;
        zip(this.store.select(fromStore.quoteSelector), this.store.select(fromStore.attributionSelector))
            .pipe(take(1))
            .subscribe(([quote, attribution]) => {
                this.isADPFQuote = quote.isADPFQuote;
                this.quoteNumber = quote.quoteNumber;
                this.premiumChangeIndicator = quote['premiumChangeIndicator'];
                if (attribution) {
                    this.redirectUrl = attribution.redirectURL;
                    this.redirectLead = attribution.redirectLead;
                    this.postLeadResult = attribution.result;
                }
            });
        if (nextRouteObj || outsideUrl) {
            this.errorSubscription = this.store
                .select(state => state.error)
                .pipe(distinctUntilChanged())
                .subscribe(error => {
                    if (error.code) {
                        this.proceedOnError(error);
                    } else {
                        this.proceedOnSuccess(nextRouteObj, outsideUrl);
                    }
                });
        }
        if (this.errorOccured) {
            this.errorSubscription.unsubscribe();
        }
        setTimeout(() => {
            this.errorSubscription.unsubscribe();
        });
    }

    proceedOnError(error) {
        this.count++;
        this.errorOccured = true;
        const errorCode = +error.code;
        if (errorCode) {
            this.numOfTimesErrorOccurredOnScreen++;
            if (this.redirectLead) {
                if (this.postLeadResult === 'success' && this.redirectUrl) {
                    this.showDialogAndRedirect();
                } else {
                    this.handleLeadPostFailure(error, errorCode);
                }
            } else {
                this.handleNonLeadPostErrors(error, errorCode);
            }
        }
    }
    handleLeadPostFailure(error, errorCode) {
        if (this.numOfTimesErrorOccurredOnScreen < 4) {
            this.dialog.open(TimeoutModalComponent, {
                data: error,
                panelClass: CUSTOMTIMEOUTMODAL
            });
        } else if (this.appSettings.DECLINE_CODES.includes(errorCode)) {
            this.gotoRouteByName('kodecline');
        } else if (this.appSettings.CALL_US_CODES.includes(errorCode)) {
            this.gotoRouteByName('contactus');
        } else if (this.appSettings.PERSONAL_DATA_ALERT_CODES.includes(errorCode)) {
            this.gotoRouteByName('personaldataalert');
        } else {
            this.gotoRouteByName('systemfailure');
        }
    }
    handleNonLeadPostErrors(error, errorCode) {
        if (this.appSettings.DECLINE_CODES.includes(errorCode)) {
            this.gotoRouteByName('kodecline');
        } else if (this.appSettings.CALL_US_CODES.includes(errorCode)) {
            this.gotoRouteByName('contactus');
        } else if (this.appSettings.PERSONAL_DATA_ALERT_CODES.includes(errorCode)) {
            this.gotoRouteByName('personaldataalert');
        } else if (this.numOfTimesErrorOccurredOnScreen < 4) {
            this.dialog.open(TimeoutModalComponent, {
                data: error,
                panelClass: CUSTOMTIMEOUTMODAL
            });
        } else {
            this.gotoRouteByName('systemfailure');
        }
    }
    proceedOnSuccess(nextRouteObj, outsideUrl?) {
        const nextRouteName = nextRouteObj ? nextRouteObj.routeName : '';
        const replaceUrl = nextRouteObj ? nextRouteObj.replaceUrl : false;
        if (nextRouteName) {
            if (nextRouteName === 'pricechange' && !this.premiumChangeIndicator) {
                this.handlePriceChange();
            } else {
                this.router.navigate([nextRouteName], { queryParamsHandling: 'merge', replaceUrl: replaceUrl });
            }
        } else {
            this.gotoUrl(outsideUrl);
        }
    }
    handlePriceChange() {
        const routeObj = this.getNextRouteByName('pricechange');
        if (routeObj && routeObj['routeName']) {
            this.gotoRouteByName(routeObj['routeName']);
        } else {
            this.gotoRouteByName('systemfailure');
        }
    }
    getNextRoute() {
        this.getPageIndexsForConditionalPages();
        const currentRouteIndex = this.getCurrentRouteIndex();
        return this.skipPageForward(currentRouteIndex + 1);
    }
    getPageIndexsForConditionalPages() {
        this.previousAddressIndex = this.getRouteIndexByName('previousaddress');
        this.sniIndex = this.getRouteIndexByName('sni');
        this.preRcVinIndex = this.getRouteIndexByName('vin/:id', { key: 'isCTAEnabled', value: true });
        this.postRcVinIndex = this.getRouteIndexByName('vin/:id', { key: 'isCTAEnabled', value: false });
        this.relationshipIndex = this.getRouteIndexByName('relationship/:id');
        this.licensePreRcIndex = this.getRouteIndexByName('licenseinfoprerc/:id');
        this.licensePostRcIndex = this.getRouteIndexByName('licenseinfopostrc/:id');
        this.sniContactIndex = this.getRouteIndexByName('snicontact/:id');
        this.titleHolderSelectIndex = this.getRouteIndexByName('titleholder-select/:id');
        this.titleHolderContactIndex = this.getRouteIndexByName('titleholder-contact/:id');
        this.phoneIndex = this.getRouteIndexByName('phone');
        this.priceChangeIndex = this.getRouteIndexByName('pricechange');
        this.docVerifyIndex = this.getRouteIndexByName('docverify');
        this.uploadDocIndex = this.getRouteIndexByName('uploadfile/:id');
        this.billingAddIndex = this.getRouteIndexByName('billingaddress');
        this.payIndex = this.getRouteIndexByName('pay');
        this.paymentConfirmInd = this.getRouteIndexByName('paymentconfirm');
        this.paymentStatusInd = this.getRouteIndexByName('paymentstatus');
        this.insuranceCoverageInd = this.getRouteIndexByName('insurancecoverage');
        this.leadLandingInd = this.getRouteIndexByName('leadlanding');
        this.addVehicleInd = this.getChildRouteIndexByName('vehicleadd/:id');
    }
    skipPageForward(nextRouteIndex) {
        if (nextRouteIndex === this.previousAddressIndex && this.lived2months) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.relationshipIndex && this.isRelationshipPageSkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.sniIndex && this.isSNISkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.sniContactIndex && !this.isSNI) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.preRcVinIndex && this.isVinSkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.phoneIndex && this.isPhoneSkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.docVerifyIndex && this.isDocverifySkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.uploadDocIndex && this.isDocverifySkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.billingAddIndex && this.isBillingAddrSkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.insuranceCoverageInd && this.isADPFQuote === true) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.postRcVinIndex && this.isVinSkippable()) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.titleHolderContactIndex && !this.leasedLoanVehicles.length) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else if (nextRouteIndex === this.leadLandingInd && this.quoteNumber) {
            return this.skipPageForward(nextRouteIndex + 1);
        } else {
            return this.noForwardSkipping(nextRouteIndex);
        }
    }
    skipChildRouteForward(nextRouteIndex) {
        if (nextRouteIndex === this.addVehicleInd && this.isADPFVehicle(this.routeParam)) {
            return this.skipChildRouteForward(nextRouteIndex + 1);
        } else {
            return this.noForwardChildRouteSkipping(nextRouteIndex);
        }
    }
    skipChildRouteBackward(nextRouteIndex) {
        if (nextRouteIndex === this.addVehicleInd && this.isADPFVehicle(this.routeParam)) {
            return this.skipChildRouteBackward(nextRouteIndex - 1);
        } else {
            return this.noBackwardChildRouteSkipping(nextRouteIndex);
        }
    }
    noForwardChildRouteSkipping(nextRouteIndex) {
        return this.visibleCurrentSubRoutes[nextRouteIndex];
    }
    noBackwardChildRouteSkipping(nextRouteIndex) {
        return this.visibleCurrentSubRoutes[nextRouteIndex];
    }
    noForwardSkipping(nextRouteIndex) {
        if (this.relationshipIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.nonPNIIncludedDrivers[0].driverID
            );
        } else if (this.licensePreRcIndex === nextRouteIndex || this.licensePostRcIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(this.visibleRoutes[nextRouteIndex], this.pniDriver.driverID);
        } else if (this.titleHolderSelectIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(this.visibleRoutes[nextRouteIndex], this.includedVehicles[0].vehicleID);
        } else if (this.preRcVinIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(this.visibleRoutes[nextRouteIndex], 'true');
        } else if (this.postRcVinIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(this.visibleRoutes[nextRouteIndex], 'false');
        } else if (this.titleHolderContactIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.leasedLoanVehicles[0].vehicleID
            );
        }
        return this.visibleRoutes[nextRouteIndex];
    }
    skipPageBackward(nextRouteIndex) {
        if (nextRouteIndex === this.previousAddressIndex && this.lived2months) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.relationshipIndex && this.isRelationshipPageSkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.sniIndex && this.isSNISkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.sniContactIndex) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.preRcVinIndex && this.isVinSkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.phoneIndex && this.isPhoneSkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.priceChangeIndex && this.isPriceChangeSkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.billingAddIndex && this.isBillingAddrSkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.docVerifyIndex && this.isDocverifySkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.uploadDocIndex && this.isDocverifySkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.payIndex) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.paymentStatusInd) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.paymentConfirmInd) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.titleHolderContactIndex && !this.leasedLoanVehicles.length) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.insuranceCoverageInd && this.isADPFQuote === true) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.postRcVinIndex && this.isVinSkippable()) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else if (nextRouteIndex === this.leadLandingInd && this.quoteNumber) {
            return this.skipPageBackward(nextRouteIndex - 1);
        } else {
            return this.noBackwardSkipping(nextRouteIndex);
        }
    }
    noBackwardSkipping(nextRouteIndex) {
        if (this.relationshipIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.nonPNIIncludedDrivers[this.nonPNIIncludedDrivers.length - 1].driverID
            );
        } else if (this.licensePreRcIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.includedDrivers[this.includedDrivers.length - 1].driverID
            );
        } else if (this.licensePostRcIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.drsWithVldLcnsAndHasOwnLcns[this.drsWithVldLcnsAndHasOwnLcns.length - 1].driverID
            );
        } else if (this.preRcVinIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(this.visibleRoutes[nextRouteIndex], 'true');
        } else if (this.postRcVinIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(this.visibleRoutes[nextRouteIndex], 'false');
        } else if (this.titleHolderSelectIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.includedVehicles[this.includedVehicles.length - 1].vehicleID
            );
        } else if (this.titleHolderContactIndex === nextRouteIndex) {
            return this.formRouteWithRouteParam(
                this.visibleRoutes[nextRouteIndex],
                this.leasedLoanVehicles[this.leasedLoanVehicles.length - 1].vehicleID
            );
        }
        return this.visibleRoutes[nextRouteIndex];
    }
    getCurrentRouteIndex() {
        if (this.currentRouteObj) {
            if (this.currentRouteObj.routeName === 'vin/:id') {
                return this.visibleRoutes.findIndex(
                    routeObj =>
                        routeObj.routeName === this.currentRouteObj.routeName &&
                        routeObj.isCTAEnabled === this.currentRouteObj.isCTAEnabled
                );
            } else {
                return this.visibleRoutes.findIndex(routeObj => routeObj.routeName === this.currentRouteObj.routeName);
            }
        }
        return -1;
    }

    getNextRouteByName(routeName) {
        const routeIndex = this.visibleRoutes.findIndex(routeObj => routeObj.routeName === routeName) || 0;
        return this.visibleRoutes[routeIndex + 1];
    }
    getPrevoiusRoute() {
        this.getPageIndexsForConditionalPages();
        const currentRouteIndex = this.getCurrentRouteIndex();
        const currentSubRouteIndex = this.getCurrentSubRouteIndex();
        if (currentRouteIndex !== undefined && currentRouteIndex !== -1) {
            return this.skipPageBackward(currentRouteIndex - 1);
        }
        if (currentSubRouteIndex !== undefined && currentSubRouteIndex !== null && currentSubRouteIndex !== -1) {
            // if the sub route is the first of the children, navigate to its parent, otherwise
            const nextChildRoute = this.skipChildRouteBackward(currentSubRouteIndex - 1);
            return nextChildRoute
                ? this.formRouteWithRouteParam(nextChildRoute)
                : this.visibleRoutes[this.currentParentRouteIndex];
        }
    }

    formRouteWithRouteParam(routeObj, param?: string) {
        let updatedRouteName;
        if (!param) {
            updatedRouteName = routeObj.routeName.replace(/:id/gi, this.routeParam);
        } else {
            updatedRouteName = routeObj.routeName.replace(/:id/gi, param);
        }
        return { ...routeObj, routeName: updatedRouteName };
    }

    registerBackHandler(handleFn: Function, deregisterObservable?: Observable<any>): string {
        this.rootBackHandler = new BackHandler(uuid(), this.rootBackHandler, handleFn);

        if (deregisterObservable) {
            const handlerID = this.rootBackHandler.id;
            deregisterObservable.pipe(take(1)).subscribe(() => this.deregisterBackHandler(handlerID));
        }

        return this.rootBackHandler.id;
    }

    getRouteObjByName(routeName) {
        return this.visibleRoutes.filter(routeObj => routeObj.routeName === routeName)[0];
    }

    deregisterBackHandler(id: string): boolean {
        if (!id) {
            return false;
        }

        let prevHandler = null;
        for (
            let handler = this.rootBackHandler;
            handler.nextHandler;
            prevHandler = handler, handler = handler.nextHandler
        ) {
            if (handler.id === id) {
                if (prevHandler) {
                    prevHandler.nextHandler = handler.nextHandler;
                } else {
                    this.rootBackHandler = handler.nextHandler;
                }

                return true;
            }
        }

        return false;
    }

    private mainBackHandleFn() {
        const previousRouteObj = this.getPrevoiusRoute();
        this.router.navigate([previousRouteObj.routeName], { queryParamsHandling: 'merge' });
    }

    navigateBack() {
        function next(handler: BackHandler): Function {
            if (handler) {
                return () => {
                    handler.handle(next(handler.nextHandler));
                };
            } else {
                return () => { };
            }
        }

        this.rootBackHandler.handle(next(this.rootBackHandler.nextHandler));
    }

    getRouteIndexByName(routeName: string, options?) {
        if (options) {
            return this.visibleRoutes.findIndex(
                routeObj => routeObj.routeName === routeName && routeObj[options.key] === options.value
            );
        }
        return this.visibleRoutes.findIndex(routeObj => routeObj.routeName === routeName);
    }
    getChildRouteIndexByName(routeName: string) {
        return this.visibleCurrentSubRoutes.findIndex(routeObj => routeObj.routeName === routeName);
    }
    gotoRouteByIndex(routeIndex) {
        const routeObj = this.visibleRoutes[routeIndex];
        this.router.navigate([routeObj.routeName]);
    }

    getRouteByIndex(routeIndex) {
        return this.visibleRoutes[routeIndex];
    }

    gotoRouteByName(routeName, replaceUrl = false) {
        this.router.navigate([routeName], { queryParamsHandling: 'merge', replaceUrl: replaceUrl });
    }

    makeChangesOnRouteNav() {
        this.store
            .select(fromStore.quoteSelector)
            .pipe(take(1))
            .subscribe(quote => {
                this.isADPFQuote = quote.isADPFQuote;
                this.quoteNumber = quote.quoteNumber;
                this.premiumChangeIndicator = quote['premiumChangeIndicator'];
            });
        const routeArr = this.currentRoute.split('/');
        let childFound = false;
        let routeWithParam;
        if (routeArr[1]) {
            this.routeParam = routeArr[1];
            // for VIN screen
            if (routeArr[0] === 'vin') {
                routeWithParam = this.visibleRoutes.find(
                    routeItem =>
                        routeItem.routeName === routeArr[0] + '/:id' &&
                        routeItem.isCTAEnabled.toString() === routeArr[1]
                );
                this.currentRouteIndex = this.visibleRoutes.findIndex(
                    routeItem =>
                        routeItem.routeName === routeArr[0] + '/:id' &&
                        routeItem.isCTAEnabled.toString() === routeArr[1]
                );
            } else {
                routeWithParam = this.visibleRoutes.find(routeItem => routeItem.routeName === routeArr[0] + '/:id');
                this.currentRouteIndex = this.visibleRoutes.findIndex(
                    routeItem => routeItem.routeName === routeArr[0] + '/:id'
                );
            }
            if (routeWithParam) {
                this.currentParentRouteIndex = 0;
                this.currentRouteObj = routeWithParam;
                this.visibleCurrentSubRoutes = this.getVisibleSubRoutesByRoute(this.currentRouteObj.routeName);
            } else {
                this.visibleRoutes.forEach((route, index) => {
                    if (!childFound && route['childRoutes']) {
                        const childIndex = route['childRoutes'].findIndex(
                            childRoute => childRoute.routeName.split('/:id')[0] === this.currentRoute.split('/')[0]
                        );
                        if (childIndex > -1) {
                            this.currentParentRouteIndex = index;
                            this.currentRouteObj = route['childRoutes'][childIndex];
                            childFound = true;
                        }
                    }
                });
            }
        } else {
            this.currentParentRouteIndex = 0;
            this.currentRouteObj = this.visibleRoutes.filter(routeObj => routeObj.routeName === this.currentRoute)[0];
            this.currentRouteIndex = this.visibleRoutes.findIndex(
                routeObj => routeObj.routeName === this.currentRoute
            )[0];
            this.visibleCurrentSubRoutes = this.getVisibleSubRoutesByRoute(this.currentRoute);
        }
    }

    upDateMarketingData() {
        const marketingData = {
            currentURL: window.location.href,
            currentRoute: this.currentRoute
        };
        this.store.dispatch(new LeadActions.SaveMarketingData(marketingData));
    }
    isLastVisibleChildRoute() {
        return !this.getNextSubRoute();
    }
    isVinSkippable() {
        if (!this.nonAdpfIncludedVehicles.length) {
            return true;
        }
        return false;
    }

    isSNISkippable() {
        if (!this.driversValidLicense.length) {
            return true;
        }
        return false;
    }

    isPhoneSkippable() {
        return this.hasPhoneNumber && !this.phoneSetOnPhonePage;
    }

    isDocverifySkippable() {
        return !this.requiredVerificationDocuments;
    }
    isBillingAddrSkippable() {
        return this.updatePayerInfoAddress;
    }
    isRelationshipPageSkippable() {
        return !this.nonPNIIncludedDrivers.length;
    }

    isPriceChangeSkippable() {
        return !this.premiumChangeIndicator;
    }

    timeoutThenRouteToSystemFailure<T>(timeoutPredicate: (err) => boolean): MonoTypeOperatorFunction<T> {
        return input$ =>
            input$.pipe(
                retryWhen(errors =>
                    errors.pipe(
                        mergeMap(error => {
                            if (timeoutPredicate(error)) {
                                return this.dialog
                                    .open(TimeoutModalComponent, {
                                        data: error,
                                        panelClass: CUSTOMTIMEOUTMODAL
                                    })
                                    .afterClosed();
                            }
                            return throwError(error);
                        })
                    )
                ),
                catchError(_ => {
                    this.routeToSystemFailure();
                    return EMPTY;
                })
            );
    }

    routeToSystemFailure(): void {
        this.store.dispatch(new StopLoaderAction());
        const customError = {
            code: 600,
            message: 'Service Failure/down'
        };
        this.store.dispatch(new SetErrorAction(customError));
        this.gotoRouteByName('systemfailure');
    }

    gotoUrl(url) {
        window.location.href = url;
    }
    showDialogAndRedirect() {
        const oppDialogRef = this.dialog.open(OpportunityModalComponent);
        oppDialogRef.afterOpened().subscribe(_data => {
            setTimeout(() => {
                window.location.href = this.redirectUrl;
                oppDialogRef.close();
            }, this.appSettings.LEAD_REDIRECT_AUTO_DISMISS_TIME);
        });
    }
}
class BackHandler {
    constructor(
        public readonly id: string,
        public readonly nextHandler: BackHandler,
        public readonly handle: Function
    ) { }
}
