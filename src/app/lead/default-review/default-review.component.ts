import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
import { MatDialog, MatSnackBarRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject, zip, Subscription } from 'rxjs';
import { take, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { NavigationService } from '@app/core/services/navigation.service';
import { ReviewAllDetailsModalComponent } from '@shared/review-all-details-modal/review-all-details-modal.component';
import * as fromStore from '@app/store/reducers/lead.reducers';
import {
    TitleHolder,
    Vehicle,
    Lead,
    Driver,
    QuickQuote,
    Quote
} from '@app/store/models/lead.model';
import * as LeadActions from '@app/store/actions/lead.actions';
import { DriverIconService } from '@services/driver-icon.service';
import { DefaultReviewService } from '@services/default-review.service';
import { CoveragesPageAlertModalComponent } from '@shared/coverages-page-alert-modal/coverages-page-alert-modal.component';
import { SnackbarService } from '@services/snackbar.service';
import { NO_COVERAGE } from '@app/core/constants';
@Component({
    selector: 'verti-default-review',
    templateUrl: './default-review.component.html',
    styleUrls: ['./default-review.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('fade', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [animate(300)]),
            transition(':leave', [animate(500)])
        ])
    ]
})
export class DefaultReviewComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class.verti-default-review') mainClass = true;
    @ViewChild('stickyHead') stickyHead: ElementRef;
    public overviewData: QuickQuote;
    public quoteData: Quote;
    public premiumPrice: number;
    public stickyHeader: boolean;
    public editPolicy: boolean;
    public editVehicles: boolean;
    private stickyPosition: number;
    private ngDestroy$ = new Subject();
    leasedLoanVehicles: Vehicle[];
    nonAdpfIncludedVehicles: Vehicle[];
    showHide: boolean;
    showCoverageList: string;
    tempString: string;
    driverObservable$: any;
    driverData: Driver[];
    vehiclesLength: number;
    firstPartyBenefits = [];
    liabilityCoverages = [];
    vehicleCoverages = [];
    policyDate: string;
    clonedQuickQuoteData: QuickQuote;
    clonedQuoteData: Quote;
    savedQuickQuoteData: QuickQuote;
    savedQuoteData: Quote;
    vehicleRecalculateButton: boolean;
    policyRecalculateButton: boolean;
    applyToAllVehiclesFlag: boolean;
    showAccidentForgiveness: boolean;
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    errorSubscription: any;
    coveragesEdited: boolean;
    showApplyToAllVehicle: boolean;
    pageEditModal: boolean;
    disabledMenu: boolean;
    noValidationError: boolean;
    snackBarRef: MatSnackBarRef<any>;
    savedLeadData: Lead;
    constructor(
        public dialog: MatDialog,
        private store: Store<any>,
        private navService: NavigationService,
        private driverIconService: DriverIconService,
        private defaultReviewService: DefaultReviewService,
        private snackbarService: SnackbarService,
        private cdrf: ChangeDetectorRef
    ) {
        this.editPolicy = false;
        this.editVehicles = false;
        this.showHide = false;
        this.vehicleRecalculateButton = false;
        this.policyRecalculateButton = false;
        this.applyToAllVehiclesFlag = false;
        this.coveragesEdited = false;
        this.pageEditModal = false;
        this.noValidationError = true;
        this.showAccidentForgiveness = false;
    }
    public ngOnInit(): void {
        this.defaultReviewService
            .getCoverageDetails()
            .pipe()
            .subscribe(coverage => {
                this.firstPartyBenefits = coverage.firstPartyCoverages;
                this.liabilityCoverages = coverage.liabilityCoverages;
                this.vehicleCoverages = coverage.vehicleCoverages;
            });

        zip(this.store.select(fromStore.quickQuoteSelector), this.store.select(fromStore.quoteSelector))
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(([quickQuote, quote]) => {
                this.overviewData = quickQuote;
                this.clonedQuickQuoteData = { ...quickQuote };
                this.quoteData = quote;
                this.clonedQuoteData = { ...quote };
                this.savedQuickQuoteData = { ...quickQuote };
                this.savedQuoteData = { ...quote };
                this.updateFlagsForBackend();
                this.updateSession();
                this.navService.upDateMarketingData();
                this.verifyProperties();
                const startDate = quickQuote.periodStartDate;
                if (startDate.year && startDate.month && startDate.day) {
                    this.policyDate = startDate.month + '/' + startDate.day + '/' + startDate.year;
                }
            });

        this.store
            .select(fromStore.quoteSelector)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(quote => {
                this.quoteData = quote;
                this.verifyProperties();
                this.premiumPrice = this.quoteData.monthlyPremium || +'';
            });

        this.store
            .select(fromStore.quickQuoteSelector)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(quickQuote => {
                this.overviewData = quickQuote;
                this.verifyProperties();
            });

        this.getDriversDetails();
    }

    verifyProperties() {
        const policyData = this.quoteData.policyCoverage;
        if (policyData.futureAccident || policyData.currentAccident || policyData.immediateAccident) {
            this.showAccidentForgiveness = true;
        } else {
            this.showAccidentForgiveness = false;
        }
        const includedVehicleCount = this.overviewData.vehicles.filter(vehicle => vehicle.isIncluded).length;
        if (includedVehicleCount > 1) {
            this.showApplyToAllVehicle = true;
        }
    }

    getDriversDetails() {
        this.driverObservable$ = this.store
            .select(fromStore.drivers)
            .pipe(distinctUntilChanged())
            .subscribe(drivers => {
                if (drivers.length) {
                    this.driverData = drivers.filter(driver => driver.isIncluded);
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
                genderImg: `assets/img/${this.driverIconService.getDriverImageName(driver)}.svg`,
                genderCode: driver.genderCode === 'M' ? 'male' : driver.genderCode === 'F' ? 'female' : ''
            };
        });
    }

    updateFlagsForBackend() {
        this.leasedLoanVehicles = this.overviewData.vehicles.filter(
            vehicle => vehicle.isIncluded && [TitleHolder.LEASE, TitleHolder.LOAN].includes(vehicle.titleHolder)
        );
        this.nonAdpfIncludedVehicles = this.overviewData.vehicles.filter(
            vehicle => vehicle.isIncluded && !vehicle.isADPF
        );
        if (this.nonAdpfIncludedVehicles.length || this.leasedLoanVehicles.length) {
            this.store.dispatch(new LeadActions.UpdateGenerateQuickQuotePriceFlag({ finalizeQuote: false }));
        }
    }
    updateSession() {
        window['conciergeReady'].then(() => {
            window['GoMoxie'].conciergeV2.updateSession({
                transactionTotal: this.premiumPrice,
                currentCartValue: this.premiumPrice
            });
        });
    }
    public ngAfterViewInit(): void {
        this.stickyPosition = this.stickyHead.nativeElement.offsetTop;
    }

    @HostListener('window:scroll', ['$event'])
    public onWindowScroll(e): void {
        const element = document.getElementById('normalHeader');
        if (element) {
            if (window.scrollY >= this.stickyPosition + 240) {
                element.classList.add('normal-header-invisable');
                this.stickyHeader = true;
            } else {
                element.classList.remove('normal-header-invisable');
                this.stickyHeader = false;
            }
        }
    }
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.coveragesEdited) {
            $event.returnValue = true;
        } else {
            $event.returnValue = false;
        }
    }
    public doContinue(): void {
        this.coveragesEdited = false;
        if (this.checkWhetherLeaseLoanToBePresent()) {
            this.snackBarRef = this.snackbarService.openSnackBar({
                message: `Lease or Lienholder or Rideshare may require you to carry comprehensive and collision coverage.`
            });
            this.snackBarRef.afterDismissed().subscribe(info => {
                if (info.dismissedByAction === true) {
                    this.noValidationError = true;
                    this.continuePurchase();
                }
            });
        } else {
            this.continuePurchase();
        }
    }
    continuePurchase() {
        this.navService.navigate();
    }
    checkWhetherLeaseLoanToBePresent(vehicleID?) {
        let vehicles;
        if (vehicleID) {
            vehicles = this.overviewData.vehicles.filter(veh => veh.vehicleID !== vehicleID);
        } else {
            vehicles = this.overviewData.vehicles;
        }
        if (vehicles && vehicles.length) {
            return vehicles.some(v => {
                return (
                    (v.titleHolder === 'LIEN' || v.titleHolder === 'LESSOR' || v.usedInRideSharing) && !v.selCodeColl
                );
            });
        }
    
    }
    public openDialog(): void {
        this.navService.gotoRouteByName('callcustomize');
    }

    public reviewDetails(): void {
        const openreviewModal = this.dialog.open(ReviewAllDetailsModalComponent, {
            panelClass: 'review-alldetails-modal'
        });
        openreviewModal.afterClosed().subscribe(res => {
            if (res) {
                this.editPolicyCoverage();
            }
        });
    }

    editPolicyCoverage() {
        window.scrollTo(0, 0);
        this.editPolicy = true;
    }
    editVehiclesCoverage() {
        window.scrollTo(0, 0);
        this.editVehicles = true;
    }

    selectedPolicyMenu(menuObj, coverageStr) {
        this.coveragesEdited = true;
        this.pageEditModal = true;
        let payload = {};

        if (coverageStr === 'selCodeCombined' && menuObj.value === 'I Decline') {
            this.combinedBenefitsChanges();
        }

        if (coverageStr === 'selCodeUMBI') {
            this.motoristCoverageChange(coverageStr, menuObj);
        } else if (coverageStr === 'selCodeUIMBI') {
            this.motoristCoverageChange(coverageStr, menuObj);
        }

        switch (coverageStr) {
            case 'selCodeBiLimit':
                this.noValidationError = this.bodilyInjuryValidation(menuObj, coverageStr);
                payload = {
                    bILimit: menuObj.value,
                    selCodeBiLimit: menuObj.code,
                    selValueBiLimit: menuObj.name
                };
                break;
            case 'selCodeProperty':
                payload = {
                    pDLimit: menuObj.value,
                    selCodeProperty: menuObj.code,
                    selValueProperty: menuObj.name
                };
                break;
            case 'selCodeTort':
                payload = {
                    tort: menuObj.value,
                    selCodeTort: menuObj.code,
                    selValueTort: menuObj.name
                };
                break;

            case 'selCodeUMBI':
                this.noValidationError = this.bodilyInjuryValidation(menuObj, coverageStr);
                payload = {
                    uMBILimit: menuObj.value,
                    selCodeUMBI: menuObj.code,
                    selValueUMBI: menuObj.name
                };
                break;

            case 'selCodeStackUMBI':
                payload = {
                    stackedUMBILimit: menuObj.value,
                    selCodeStackUMBI: menuObj.code,
                    selValueStackUMBI: menuObj.name
                };
                break;

            case 'selCodeUIMBI':
                this.noValidationError = this.bodilyInjuryValidation(menuObj, coverageStr);
                payload = {
                    uIMBILimit: menuObj.value,
                    selCodeUIMBI: menuObj.code,
                    selValueUIMBI: menuObj.name
                };
                break;

            case 'selCodeStackUIMBI':
                payload = {
                    stackedUIMBILimit: menuObj.value,
                    selCodeStackUIMBI: menuObj.code,
                    selValueStackUIMBI: menuObj.name
                };
                break;

            case 'identityTheft':
                payload = {
                    idTheft: menuObj.value,
                    identityTheft: menuObj.value
                };
                break;

            case 'selCodeCombined':
                payload = {
                    combined: menuObj.value === 'I Decline' ? NO_COVERAGE : menuObj.value,
                    selCodeCombined: menuObj.code,
                    selValueCombined: menuObj.name
                };
                break;

            case 'selCodeMedical':
                payload = {
                    medical: menuObj.value,
                    selCodeMedical: menuObj.code,
                    selValueMedical: menuObj.name
                };
                break;

            case 'selCodeExtraMed':
                payload = {
                    extraMedical: menuObj.value,
                    selCodeExtraMed: menuObj.code,
                    selValueExtraMed: menuObj.name
                };
                break;
            case 'selCodeIncome':
                payload = {
                    income: menuObj.value,
                    selCodeIncome: menuObj.code,
                    selValueIncome: menuObj.name
                };
                break;
            case 'selCodeDeath':
                payload = {
                    death: menuObj.value,
                    selCodeDeath: menuObj.code,
                    selValueDeath: menuObj.name
                };
                break;
            case 'selCodeFuneral':
                payload = {
                    funeral: menuObj.value,
                    selCodeFuneral: menuObj.code,
                    selValueFuneral: menuObj.name
                };
                break;
            default: {
                break;
            }
        }
        this.policyRecalculateButton = true;
        if (this.noValidationError) {
            this.store.dispatch(new LeadActions.UpdatePolicyCoverage({ payload }));
        }
    }
    combinedBenefitsChanges() {
        let payload = {};
        const policyCoverage = this.quoteData.policyCoverage;
        this.firstPartyBenefits.forEach(item => {
            const itemValue = item.options[0].value;
            const itemCode = item.options[0].code;
            switch (item.code) {
                case 'PAPIPPA_MEDICAL':
                    payload = {
                        medical: policyCoverage.medical || itemValue,
                        selCodeMedical: policyCoverage.selCodeMedical || itemCode,
                        selValueMedical: policyCoverage.selValueMedical || itemValue
                    };
                    break;
                case 'PAPIPPA_INCOME':
                    payload = {
                        income: policyCoverage.income || itemValue,
                        selCodeIncome: policyCoverage.selCodeIncome || itemCode,
                        selValueIncome: policyCoverage.selValueIncome || itemValue
                    };
                    break;
                case 'PAPIPPA_DEATH':
                    payload = {
                        death: policyCoverage.death || itemValue,
                        selCodeDeath: policyCoverage.selCodeDeath || itemCode,
                        selValueDeath: policyCoverage.selValueDeath || itemValue
                    };
                    break;
                case 'PAPIPPA_FUNERAL':
                    payload = {
                        funeral: policyCoverage.funeral || itemValue,
                        selCodeFuneral: policyCoverage.selCodeFuneral || itemCode,
                        selValueFuneral: policyCoverage.selValueFuneral || itemValue
                    };
                    break;
                case 'PAPIPPA_EXTRAMED':
                    payload = {
                        extraMedical: policyCoverage.extraMedical || itemValue,
                        selCodeExtraMed: policyCoverage.selCodeExtraMed || itemCode,
                        selValueExtraMed: policyCoverage.selValueExtraMed || itemValue
                    };
                    break;
                default:
                    break;
            }
            this.store.dispatch(new LeadActions.UpdatePolicyCoverage({ payload }));
        });
    }
    motoristCoverageChange(coverageStr, menuObj) {
        let payload = {};
        if (coverageStr === 'selCodeUMBI' && menuObj.value === NO_COVERAGE) {
            payload = {
                stackedUMBILimit: 'No',
                selCodeStackUMBI: 'false',
                selValueStackUMBI: 'No'
            };
            this.store.dispatch(new LeadActions.UpdatePolicyCoverage({ payload }));
        }
        if (coverageStr === 'selCodeUIMBI' && menuObj.value === NO_COVERAGE) {
            payload = {
                stackedUIMBILimit: 'No',
                selCodeStackUIMBI: 'false',
                selValueStackUIMBI: 'No'
            };
            this.store.dispatch(new LeadActions.UpdatePolicyCoverage({ payload }));
        }
    }
    makeMenuDisable() {
        this.disabledMenu = true;
    }
    makeMenuEnable() {
        this.disabledMenu = false;
        this.cdrf.detectChanges();
    }
    bodilyInjuryValidation(menuObj, coverageStr) {
        const bILimit = this.quoteData.policyCoverage.selValueBiLimit.split('/');
        const uMBILimit = this.quoteData.policyCoverage.selValueUMBI.split('/');
        const uIMBILimit = this.quoteData.policyCoverage.selValueUIMBI.split('/');
        const bILimitTrim = +bILimit[0].replace(/,/g, '');
        const uMBILimitTrim = +uMBILimit[0].replace(/,/g, '');
        const uIMBILimitTrim = +uIMBILimit[0].replace(/,/g, '');
        let payload;
        if (coverageStr === 'selCodeBiLimit') {
            return this.biLimitCoverageValidation(menuObj, uMBILimitTrim, uIMBILimitTrim);
        } else if (coverageStr === 'selCodeUMBI') {
            return this.umbiCoverageValidation(menuObj, bILimitTrim);
        } else if (coverageStr === 'selCodeUIMBI') {
            const selCodeUIMBI = menuObj.name.split('/');
            const temp1 = +selCodeUIMBI[0].replace(/,/g, '');
            if (bILimitTrim >= temp1) {
                return true;
            } else {
                this.makeMenuDisable();
                this.snackBarRef = this.snackbarService.openSnackBar({
                    message: `Underinsured coverage can\'t be higher than your Bodily Injury coverage.
                    Simply increase your Bodily Injury limits before you select the higher Underinsured coverage.`
                });
                this.snackBarRef.afterDismissed().subscribe(info => {
                    if (info.dismissedByAction === true) {
                        this.noValidationError = true;
                        this.makeMenuEnable();
                        payload = {
                            uIMBILimit: this.clonedQuoteData.policyCoverage.uIMBILimit,
                            selCodeUIMBI: this.clonedQuoteData.policyCoverage.selCodeUIMBI,
                            selValueUIMBI: this.clonedQuoteData.policyCoverage.selValueUIMBI
                        };
                    }
                });
                return false;
            }
        }
    }
    biLimitCoverageValidation(menuObj, uMBILimitTrim, uIMBILimitTrim) {
        let payload;
        const bILimit2 = menuObj.name.split('/');
        const temp1 = +bILimit2[0].replace(/,/g, '');
        if (temp1 >= uMBILimitTrim && temp1 >= uIMBILimitTrim) {
            return true;
        } else {
            this.makeMenuDisable();
            this.snackBarRef = this.snackbarService.openSnackBar({
                message: `Your Bodily Injury coverage can\'t be less than the Uninsured and Underinsured coverage.
                If you really want to lower your Bodily Injury coverage, simply reduce the Uninsured & Underinsured coverage as well.`
            });
            this.snackBarRef.afterDismissed().subscribe(info => {
                if (info.dismissedByAction === true) {
                    this.noValidationError = true;
                    this.makeMenuEnable();
                    payload = {
                        bILimit: this.clonedQuoteData.policyCoverage.bILimit,
                        selCodeBiLimit: this.clonedQuoteData.policyCoverage.selCodeBiLimit,
                        selValueBiLimit: this.clonedQuoteData.policyCoverage.selValueBiLimit
                    };
                }
            });
            return false;
        }
    }
    umbiCoverageValidation(menuObj, bILimitTrim) {
        let payload;
        const selCodeUMBI = menuObj.name.split('/');
        const temp1 = +selCodeUMBI[0].replace(/,/g, '');
        if (bILimitTrim >= temp1) {
            return true;
        } else {
            this.makeMenuDisable();
            this.snackBarRef = this.snackbarService.openSnackBar({
                message: `Uninsured coverage can\'t be higher than your Bodily Injury coverage.
                Simply increase your Bodily Injury limits before you select the higher Uninsured coverage.`
            });
            this.snackBarRef.afterDismissed().subscribe(info => {
                if (info.dismissedByAction === true) {
                    this.noValidationError = true;
                    this.makeMenuEnable();
                    payload = {
                        uMBILimit: this.clonedQuoteData.policyCoverage.uMBILimit,
                        selCodeUMBI: this.clonedQuoteData.policyCoverage.selCodeUMBI,
                        selValueUMBI: this.clonedQuoteData.policyCoverage.selValueUMBI
                    };
                }
            });
            return false;
        }
    }
    onChangePolicy(event, coverageStr) {
        this.coveragesEdited = true;
        this.pageEditModal = true;
        const checkVal = event.checked ? 'Yes' : 'No';
        let payload = {};
        if (coverageStr === 'stackedUMBILimit') {
            payload = {
                stackedUMBILimit: checkVal,
                selCodeStackUMBI: event.checked,
                selValueStackUMBI: checkVal
            };
        } else if (coverageStr === 'stackedUIMBILimit') {
            payload = {
                stackedUIMBILimit: checkVal,
                selCodeStackUIMBI: event.checked,
                selValueStackUIMBI: checkVal
            };
        } else {
            payload = {
                identityTheft: checkVal,
                idTheft: event.checked
            };
        }
        this.store.dispatch(new LeadActions.UpdatePolicyCoverage({ payload }));
        this.policyRecalculateButton = true;
    }

    selectedVehicleMenu(coverageStr, menuObj, vehicleObj) {
        this.coveragesEdited = true;
        this.pageEditModal = true;
        let buildVehicleObj = {};
        if (coverageStr === 'compDeductible') {
            buildVehicleObj = this.compDeductibleCoverage(coverageStr, menuObj, vehicleObj);
        } else if (coverageStr === 'collDeductible') {
            buildVehicleObj = this.collDeductibleCoverage(coverageStr, menuObj, vehicleObj);
        } else {
            buildVehicleObj = {
                vehicleID: vehicleObj.vehicleID,
                rentalDisplayValue: menuObj.value,
                rental: menuObj.value,
                selValueRental: menuObj.name,
                selCodeRental: menuObj.code
            };
        }
        this.store.dispatch(new LeadActions.UpdateVehicle(buildVehicleObj));
        this.vehicleRecalculateButton = true;
    }
    compDeductibleCoverage(coverageStr, menuObj, vehicleObj) {
        let buildVehicleObj = {};
        if (menuObj.value === NO_COVERAGE) {
            buildVehicleObj = {
                vehicleID: vehicleObj.vehicleID,
                compDisplayValue: menuObj.value,
                compDeductible: menuObj.value,
                selValueComp: menuObj.name,
                selCodeComp: menuObj.code,
                collDisplayValue: menuObj.value,
                collDeductible: menuObj.value,
                selValueColl: menuObj.name,
                selCodeColl: menuObj.code,
                rentalDisplayValue: menuObj.value,
                rental: menuObj.value,
                selValueRental: menuObj.name,
                selCodeRental: menuObj.code,
                selRoadSide: false
            };
            if (this.vehiclePropertiesCheck(vehicleObj, 'selLoanLease')) {
                buildVehicleObj = { ...buildVehicleObj, selLoanLease: false };
            }
            this.checkLeaseLienholder(vehicleObj, menuObj, coverageStr);
            return buildVehicleObj;
        } else {
            buildVehicleObj = {
                vehicleID: vehicleObj.vehicleID,
                compDisplayValue: menuObj.value,
                compDeductible: menuObj.value,
                selValueComp: menuObj.name,
                selCodeComp: menuObj.code
            };
            if (!vehicleObj.selCodeColl) {
                this.checkLeaseLienholder(vehicleObj, menuObj, coverageStr);
            }
            return buildVehicleObj;
        }
    }
    collDeductibleCoverage(coverageStr, menuObj, vehicleObj) {
        let buildVehicleObj = {};
        if (menuObj.value === NO_COVERAGE) {
            buildVehicleObj = {
                vehicleID: vehicleObj.vehicleID,
                collDisplayValue: menuObj.value,
                collDeductible: menuObj.value,
                selValueColl: menuObj.name,
                selCodeColl: menuObj.code,
                rentalDisplayValue: menuObj.value,
                rental: menuObj.value,
                selValueRental: menuObj.name,
                selCodeRental: menuObj.code,
                selRoadSide: false
            };
            if (this.vehiclePropertiesCheck(vehicleObj, 'selLoanLease')) {
                buildVehicleObj = { ...buildVehicleObj, selLoanLease: false };
            }
            this.checkLeaseLienholder(vehicleObj, menuObj, coverageStr);
            return buildVehicleObj;
        } else {
            buildVehicleObj = {
                vehicleID: vehicleObj.vehicleID,
                collDisplayValue: menuObj.value,
                collDeductible: menuObj.value,
                selValueColl: menuObj.name,
                selCodeColl: menuObj.code
            };
            return buildVehicleObj;
        }
    }
    checkLeaseLienholder(vehicleObj, menuObj, coverageStr) {
        if (vehicleObj.titleHolder === 'LIEN' || vehicleObj.titleHolder === 'LESSOR' || vehicleObj.usedInRideSharing) {
            this.makeMenuDisable();
            this.openLienHolderSnackBar(vehicleObj, coverageStr);
        }
    }
    openLienHolderSnackBar(vehicleObj, coverageStr) {
        let buildVehicleObj;
        this.snackBarRef = this.snackbarService.openSnackBar({
            message: `Lease or Lienholder or Rideshare may require you to carry comprehensive and collision coverage.`
        });
        this.snackBarRef.afterDismissed().subscribe(info => {
            if (info.dismissedByAction === true) {
                this.noValidationError = true;
                this.makeMenuEnable();
                // your code for handling this goes here
                return this.clonedQuickQuoteData.vehicles.filter(vehicle => {
                    if (vehicle.vehicleID === vehicleObj.vehicleID) {
                        if (coverageStr === 'compDeductible') {
                            buildVehicleObj = {
                                vehicleID: vehicleObj.vehicleID,
                                compDisplayValue: vehicle.compDisplayValue,
                                compDeductible: vehicle.compDeductible,
                                selValueComp: vehicle.selValueComp,
                                selCodeComp: vehicle.selCodeComp
                            };
                        } else {
                            buildVehicleObj = {
                                vehicleID: vehicleObj.vehicleID,
                                collDisplayValue: vehicle.collDisplayValue,
                                collDeductible: vehicle.collDeductible,
                                selValueColl: vehicle.selValueColl,
                                selCodeColl: vehicle.selCodeColl
                            };
                        }
                    }
                });
            }
        });
    }

    onChange(event, coverageStr, vehicleObj) {
        this.coveragesEdited = true;
        this.pageEditModal = true;
        let buildVehicleObj = {};
        if (coverageStr === 'applyToAllVehicle') {
            this.applyToAllVehDebucts(event, vehicleObj);
        } else {
            if (coverageStr === 'selLoanLease') {
                buildVehicleObj = {
                    vehicleID: vehicleObj,
                    selLoanLease: event.checked
                };
            } else {
                buildVehicleObj = {
                    vehicleID: vehicleObj,
                    selRoadSide: event.checked
                };
            }
            this.store.dispatch(new LeadActions.UpdateVehicle(buildVehicleObj));
        }
        this.vehicleRecalculateButton = true;
    }
    applyToAllVehDebucts(event, vehicleObj) {
        let buildVehicleObj = {};
        if (vehicleObj.hasOwnProperty('applyAllVehicles')) {
            if (event.checked) {
                buildVehicleObj = this.copyVehDebuctsToAllVehicles(event.checked, vehicleObj);
            } else {
                buildVehicleObj = this.copyVehDebuctsToAllVehicles(event.checked, vehicleObj, 'changeFlagToFalse');
            }
        } else {
            buildVehicleObj = this.copyVehDebuctsToAllVehicles(event.checked, vehicleObj);
        }
        this.store.dispatch(new LeadActions.UpdateAllVehicles(buildVehicleObj));
        if (event.checked && this.checkWhetherLeaseLoanToBePresent(vehicleObj.vehicleID)) {
            this.makeMenuDisable();
            this.snackBarRef = this.snackbarService.openSnackBar({
                message: `Lease or Lienholder or Rideshare may require you to carry comprehensive and collision coverage.`
            });
            this.snackBarRef.afterDismissed().subscribe(info => {
                if (info.dismissedByAction === true) {
                    this.noValidationError = true;
                    this.makeMenuEnable();
                }
            });
        }
    }
    allVehiclesFlageToFalse(tempObj, vehObj, switchVal) {
        return tempObj.map(vehicle => {
            if (vehicle.vehicleID === vehObj.vehicleID) {
                vehicle.applyAllVehicles = switchVal;
            }
            return {
                ...vehicle
            };
        });
    }
    allVehiclesFlageToChanged(tempObj, vehObj, switchVal) {
        return tempObj.map(vehicle => {
            if (vehicle.vehicleID === vehObj.vehicleID) {
                vehicle.applyAllVehicles = switchVal;
            } else {
                vehicle.selCodeComp = vehObj.selCodeComp;
                vehicle.selValueComp = vehObj.selValueComp;
                vehicle.compDisplayValue = vehObj.compDisplayValue;
                vehicle.compDeductible = vehObj.compDeductible;
                vehicle.selCodeColl = vehObj.selCodeColl;
                vehicle.selValueColl = vehObj.selValueColl;
                vehicle.collDisplayValue = vehObj.collDisplayValue;
                vehicle.collDeductible = vehObj.collDeductible;
                vehicle.applyAllVehicles = false;
                vehicle.rentalDisplayValue = vehObj.rentalDisplayValue;
                vehicle.selValueRental = vehObj.selValueRental;
                vehicle.selCodeRental = vehObj.selCodeRental;
                if (this.vehiclePropertiesCheck(vehicle, 'selLoanLease') && !vehObj.selCodeColl) {
                    vehicle = { ...vehicle, selLoanLease: false };
                }
                if (this.vehiclePropertiesCheck(vehicle, 'selRoadSide') && !vehObj.selCodeColl) {
                    vehicle = { ...vehicle, selRoadSide: false };
                }
            }
            return {
                ...vehicle
            };
        });
    }
    copyVehDebuctsToAllVehicles(switchVal, vehObj, flag?) {
        const tempObj = JSON.parse(JSON.stringify(this.overviewData.vehicles));
        if (flag === 'changeFlagToFalse') {
            return this.allVehiclesFlageToFalse(tempObj, vehObj, switchVal);
        } else {
            return this.allVehiclesFlageToChanged(tempObj, vehObj, switchVal);
        }
    }

    vehiclePropertiesCheck(vehicleObj, val) {
        if (vehicleObj.hasOwnProperty(val)) {
            return true;
        }
    }
    returnBooleanValue(bolVal) {
        return bolVal === true ? 'Yes' : 'No';
    }

    saveRecalculatePrice() {
        if (this.snackBarRef) {
            this.snackBarRef.dismissWithAction();
        }
        this.pageEditModal = false;
        this.store.dispatch(new LeadActions.UpdateCustomQuoteAction({ isQuoteCustomized: true, fullQuote: false }));
        this.loaderStopped = false;
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.store.dispatch(new LeadActions.PostLeadAction(leadData));
                this.savedLeadData = leadData;
            });
        this.loaderSubscription = this.store
            .select(loaderState => loaderState.loader.isLoading)
            .subscribe(loading => {
                if (!loading && !this.loaderStopped) {
                    if (this.leadSub) {
                        this.leadSub.unsubscribe();
                        this.errorSubscription = this.store
                            .select(errState => errState.error)
                            .pipe(take(1))
                            .subscribe(error => {
                                if (error.code) {
                                    this.navService.proceedOnError(error);
                                    this.pageEditModal = true;
                                } else {
                                    this.savedQuickQuoteData = this.savedLeadData.quickQuote;
                                    this.savedQuoteData = this.savedLeadData.quote;
                                    this.editPolicy = false;
                                    this.editVehicles = false;
                                    this.stickyHeader = false;
                                    this.policyRecalculateButton = false;
                                    this.vehicleRecalculateButton = false;
                                    this.coveragesEdited = false;
                                    this.store.dispatch(
                                        new LeadActions.UpdateCustomQuoteAction({
                                            isQuoteCustomized: false,
                                            fullQuote: true
                                        })
                                    );
                                }
                            });
                    }
                    this.loaderStopped = true;
                    window.scrollTo(0, 0);
                }
            });
    }
    // getUpdateClonedData() {
    //     this.clonedQuickQuoteData = this.overviewData;
    //     this.clonedQuoteData = this.quoteData;
    // }

    back() {
        if (this.snackBarRef) {
            this.snackBarRef.dismissWithAction();
        }
        if (this.pageEditModal) {
            const dialogRef = this.dialog.open(CoveragesPageAlertModalComponent, {
                panelClass: 'common-modal-panel'
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
                if (result) {
                    this.revertStoreWithClonedData(result);
                    this.pageEditModal = false;
                }
            });
        } else {
            window.scrollTo(0, 0);
            this.editPolicy = false;
            this.editVehicles = false;
            this.stickyHeader = false;
        }
    }
    revertStore() {
        this.store.dispatch(new LeadActions.UpdatePolicyCoverage({ payload: this.savedQuoteData.policyCoverage }));
        this.store.dispatch(new LeadActions.UpdateAllVehicles(this.savedQuickQuoteData.vehicles));
    }
    revertStoreWithClonedData(bol) {
        if (bol) {
            window.scrollTo(0, 0);
            this.editPolicy = false;
            this.editVehicles = false;
            this.stickyHeader = false;
            this.policyRecalculateButton = false;
            this.vehicleRecalculateButton = false;
            this.revertStore();
        }
    }

    public ngOnDestroy(): void {
        this.ngDestroy$.next();
        if (this.driverObservable$) {
            this.driverObservable$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
