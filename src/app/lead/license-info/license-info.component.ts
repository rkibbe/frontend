import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, Subscription, timer } from 'rxjs';
import { catchError, filter, switchMap, takeUntil } from 'rxjs/operators';
import { LicenseInfoStateService } from '@services/license-info-state.service';
import { LicenseNumberValidationService } from '@services/license-number-validation.service';
import { NavigationService } from '@services/navigation.service';
import { TypeListOption, TypeListService } from '@services/type-list.service';
import { ExcludedDriverModalComponent } from '@shared/excluded-driver-modal/excluded-driver-modal.component';
import { LicenseFormatter } from '@shared/formatters/license-formatter';
import { IncludedDriverModalComponent } from '@shared/included-driver-modal/included-driver-modal.component';
import { SetErrorAction } from '@app/store/actions/error.actions';
import { StartLoaderAction, StopLoaderAction } from '@app/store/actions/loader.actions';
import { Driver, LicenseStatus, LicenseYears } from '@app/store/models/lead.model';

@Component({
    selector: 'verti-license-info',
    providers: [LicenseInfoStateService, LicenseNumberValidationService],
    templateUrl: './license-info.component.html'
})
export class LicenseInfoComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public licenseInfoGroup: FormGroup;
    fieldsNoDependency;
    fieldsDependency;
    public get title(): string {
        if (this.driver) {
            return `${this.driver.firstName} ${this.driver.lastName}'s driver's license info.`;
        }
        return `Driver's license info`;
    }

    public get licenseNumErrMsg(): string {
        return `That's not a valid ${this.stateControl ? this.stateControl.value : this.driver.licenseState} driver license number`;
    }
    public get duplicateLicenseNumErrMsg(): string {
        return `License number already used`;
    }
    private get licenseStatusControl(): FormControl {
        if (this.form) {
            return this.form.get('licenseStatus') as FormControl;
        }
        return null;
    }

    private get stateControl(): FormControl {
        return this.licenseInfoGroup.get('state') as FormControl;
    }

    public get licenseNumControl(): FormControl {
        return this.licenseInfoGroup.get('licenseNum') as FormControl;
    }

    private get licenseYearsControl(): FormControl {
        return this.licenseInfoGroup.get('licenseYears') as FormControl;
    }

    public driver: Driver;

    public statusOptions: TypeListOption[] = [];
    public stateOptions: TypeListOption[] = [];
    public yearOptions: TypeListOption[] = [];

    public showLicenseNumErrors = false;

    private prefilledLicenseNumber = false;
    private typeListOptionsGathered = false;
    private defaultValuesSet = false;
    private startedLoader = false;

    private ownInsuranceApprovedExt?: boolean;

    private pageTimeoutCount: number;
    private lastInputClock = Date.now();

    private licenseNumError$: Subscription;
    private ngDestroy$ = new Subject();

    constructor(
        public licenseFormatter: LicenseFormatter,
        private typeListService: TypeListService,
        private store: Store<any>,
        private navService: NavigationService,
        private dialog: MatDialog,
        private stateService: LicenseInfoStateService,
        private licenseNumberValidationService: LicenseNumberValidationService
    ) { }

    ngOnInit(): void {
        this.startLoader();
        this.buildForm();
        if (this.licenseStatusControl) {
            this.licenseStatusControl.valueChanges.subscribe(this.checkIfLicenseInfoShouldShow.bind(this));
        }
        if (this.stateControl) {
            this.stateControl.valueChanges.subscribe(this.updateLicenseNumberValidation.bind(this));
        }
        if (this.licenseNumControl) {
            this.licenseNumControl.valueChanges
                .pipe(filter(val => this.licenseNumControl.dirty && !!val))
                .subscribe(() => (this.lastInputClock = Date.now()));
        }
        this.requestFieldOptions();
        this.stateService.driverObservable
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(this.resetForNewDriver.bind(this));
        this.navService.upDateMarketingData();
    }

    buildForm(): void {
        const groupNoDependency: any = {};
        const groupDependency: any = {};
        this.fieldsNoDependency = this.navService.currentRouteObj.content.filter(control => control.visible && !control.hasDependency);
        this.fieldsDependency = this.navService.currentRouteObj.content.filter(control => control.visible && control.hasDependency);
        this.fieldsNoDependency.forEach(field => {
            groupNoDependency[field.attribute] = field.required ? new FormControl(field.value || '', Validators.required)
                : new FormControl(field.value || '');
        });
        if (this.fieldsNoDependency.length) {
            this.form = new FormGroup({
                licenseStatus: new FormControl(null, Validators.required)
            });
        }
        this.fieldsDependency.forEach(field => {
            if (field.attribute === 'licenseNum') {
                groupDependency[field.attribute] = field.required ?
                    new FormControl(field.value || null, Validators.required, this.validateLicenseNumber.bind(this))
                    : new FormControl(field.value || '');
            } else {
                groupDependency[field.attribute] = field.required ? new FormControl(field.value || null, Validators.required)
                    : new FormControl(field.value || '');
            }
        });
        this.licenseInfoGroup = new FormGroup(groupDependency);
    }

    resetForNewDriver(driver: Driver): void {
        this.startLoader();

        this.driver = driver;
        this.defaultValuesSet = false;
        this.showLicenseNumErrors = false;
        this.prefilledLicenseNumber = false;

        this.pageTimeoutCount = 0;

        this.ownInsuranceApprovedExt = driver.ownInsuranceApprovedExt;

        this.licenseInfoGroup.reset();
        if (this.licenseStatusControl) {
            this.licenseStatusControl.reset();
        }

        this.setDefaultDriverFields(driver);
        this.stopLoader();
    }

    startLoader(): void {
        if (!this.startedLoader) {
            this.store.dispatch(new StartLoaderAction());
            this.startedLoader = true;
        }
    }

    stopLoader(): void {
        if (this.typeListOptionsGathered && this.defaultValuesSet) {
            this.store.dispatch(new StopLoaderAction());
            this.startedLoader = false;
        }
    }

    checkIfLicenseInfoShouldShow(status: LicenseStatus): void {
        if (status === LicenseStatus.OwnInsurance && this.licenseStatusControl && !this.licenseStatusControl.dirty) {
            this.ownInsuranceApprovedExt = this.driver.ownInsuranceApprovedExt;
        } else {
            this.ownInsuranceApprovedExt = undefined;
        }

        if (status === LicenseStatus.OwnInsurance && this.licenseStatusControl && this.licenseStatusControl.dirty) {
            this.toggleLicenseInfoGroup(false);
            this.showInclusionModal();
        } else if (
            (status === LicenseStatus.NeverLicensed || status === LicenseStatus.SuspendedLicense) &&
            this.licenseStatusControl && this.licenseStatusControl.dirty
        ) {
            this.toggleLicenseInfoGroup(false);
            this.showExclusionModal();
        } else {
            this.toggleLicenseInfoGroup(this.shouldCollectLicenseInfo(status));
        }
    }

    updateLicenseNumberValidation() {
        this.showLicenseNumErrors = true;
        if (this.stateControl && this.stateControl.dirty && this.licenseNumControl && this.licenseNumControl.value) {
            this.licenseNumControl.markAsTouched();
        }
        if (this.licenseNumControl) {
            this.licenseNumControl.updateValueAndValidity();
        } else if (this.stateControl && this.stateControl.dirty) {
            this.driver.licenseNumber = null;
        }
    }

    shouldCollectLicenseInfo(status: LicenseStatus): boolean {
        return (
            status === LicenseStatus.ValidLicense ||
            (status === LicenseStatus.OwnInsurance && !this.ownInsuranceApprovedExt)
        );
    }

    toggleLicenseInfoGroup(shouldShow: boolean): void {
        if (shouldShow) {
            this.form.addControl('licenseInfoGroup', this.licenseInfoGroup);
        } else {
            this.form.removeControl('licenseInfoGroup');
        }

        this.form.updateValueAndValidity();
    }

    requestFieldOptions(): void {
        this.typeListService
            .getLicenseTypelistOptions()
            .pipe(
                catchError(this.routeToSystemFailure.bind(this)),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(typeListOptions => {
                this.stateOptions = typeListOptions.stateList || [];
                this.statusOptions = typeListOptions.statusList || [];
                this.yearOptions = typeListOptions.yearList || [];

                this.typeListOptionsGathered = true;
                this.stopLoader();
            });
    }

    setDefaultDriverFields(driver: Driver): void {
        const shouldPrefill =
            driver.isQuoteDriver || (this.navService.currentRouteObj && this.navService.currentRouteObj.preFill);
        if (this.licenseStatusControl) {
            if (driver.isPNI) {
                this.licenseStatusControl.setValue(LicenseStatus.ValidLicense);
            } else if (shouldPrefill && driver.licenseStatus) {
                this.licenseStatusControl.setValue(driver.licenseStatus);
            }
        }
        if (shouldPrefill && driver.licenseState) {
            if (this.stateControl) {
                this.stateControl.setValue(driver.licenseState);
            }

            if (driver.licenseNumber) {
                this.prefilledLicenseNumber = true;
                if (this.licenseNumControl) {
                    this.licenseNumControl.setValue(this.getStarredValue(driver.licenseNumber));
                }
            }
        } else {
            if (this.stateControl) {

                this.stateControl.setValue('PA');
            }
        }

        if (this.licenseYearsControl && shouldPrefill && driver.yearsLicensed) {
            this.licenseYearsControl.setValue(driver.yearsLicensed);
        }

        this.defaultValuesSet = true;
    }

    routeToSystemFailure(): void {
        this.store.dispatch(new StopLoaderAction());
        const customError = {
            code: 600,
            message: 'Service Failure/down'
        };
        this.store.dispatch(new SetErrorAction(customError));
        this.navService.gotoRouteByName('systemfailure');
    }

    showInclusionModal(): void {
        this.dialog
            .open(IncludedDriverModalComponent, {
                panelClass: 'license-modal-panel',
                data: this.driver
            })
            .afterClosed()
            .subscribe(included => {
                this.ownInsuranceApprovedExt = !included;
                this.toggleLicenseInfoGroup(included);

                if (!included) {
                    this.showExclusionModal();
                }
            });
    }

    showExclusionModal(): void {
        this.dialog.open(ExcludedDriverModalComponent, {
            panelClass: 'license-modal-panel',
            data: this.driver
        });
    }

    getCurrentFormInfo(): LicenseInfoUpdateObj {
        const licenseYearsMatchedOption = this.licenseYearsControl ? this.yearOptions.find(
            option => option.code === this.licenseYearsControl.value
        ) : null;
        const licenseStatus = this.licenseStatusControl ? this.licenseStatusControl.value : this.driver.licenseStatus;
        if (this.shouldCollectLicenseInfo(licenseStatus)) {
            return {
                licenseStatus: licenseStatus,
                licenseStatusValue: this.licenseStatusControl ?
                    this.statusOptions.find(status => status.code === this.licenseStatusControl.value)
                        .description : this.driver.licenseStatusValue,
                ownInsuranceApprovedExt: this.ownInsuranceApprovedExt,
                licenseNumber: this.prefilledLicenseNumber
                    ? this.driver.licenseNumber
                    : this.licenseNumControl ? this.licenseNumControl.value : this.driver.licenseNumber,
                licenseState: this.stateControl ? this.stateControl.value : '',
                yearsLicensed: this.licenseYearsControl ? this.licenseYearsControl.value : this.driver.yearsLicensed,
                yearsLicensedValue: licenseYearsMatchedOption ? licenseYearsMatchedOption.description : this.driver.yearsLicensedValue
            };
        } else {
            return {
                licenseStatus: licenseStatus,
                licenseStatusValue: this.licenseStatusControl ?
                    this.statusOptions.find(status => status.code === this.licenseStatusControl.value)
                        .description : this.driver.licenseStatusValue,
                ownInsuranceApprovedExt: this.ownInsuranceApprovedExt,
                licenseNumber: '',
                licenseState: '',
                yearsLicensed: null,
                yearsLicensedValue: ''
            };
        }
    }

    private getStarredValue(value: string): string {
        const len = value.length;
        return len <= 4 ? value : '*'.repeat(len - 4) + value.substr(len - 4);
    }

    // Handlers
    onLicenseNumFocus(): void {
        if (this.prefilledLicenseNumber) {
            this.licenseNumControl.setValue('');
        }

        if (this.licenseNumError$) {
            this.licenseNumError$.unsubscribe();
        }
    }

    onLicenseNumInput(): void {
        this.prefilledLicenseNumber = false;
    }

    onLicenseNumBlur(): void {
        if (this.prefilledLicenseNumber) {
            this.licenseNumControl.setValue(this.getStarredValue(this.driver.licenseNumber));
        }

        if (this.licenseNumControl.pending) {
            this.showLicenseNumErrors = true;
            this.licenseNumError$ = this.licenseNumControl.statusChanges
                .pipe(takeUntil(this.ngDestroy$))
                .subscribe(status => (this.showLicenseNumErrors = status === 'INVALID' || status === 'PENDING'));
        } else {
            this.showLicenseNumErrors = !this.licenseNumControl.valid;
        }
    }

    onSubmit(): void {
        this.stateService.continue(this.getCurrentFormInfo());
    }

    // Validator
    validateLicenseNumber(control: AbstractControl): Observable<any> {
        if (this.stateControl && this.stateControl.value === 'ForeignOperatorExt' || this.driver.licenseState === 'ForeignOperatorExt') {
            return of(null);
        }

        const diff = Date.now() - this.lastInputClock;

        return timer(diff < 1000 ? 1000 : 0).pipe(
            switchMap(_ =>
                this.licenseNumberValidationService.validateLicenseNumber(
                    this.stateControl ? this.stateControl.value : this.driver.licenseState,
                    this.prefilledLicenseNumber ? this.driver.licenseNumber : control.value,
                    this.driver.driverID
                )
            ),
            this.navService.timeoutThenRouteToSystemFailure(() => this.pageTimeoutCount++ < 3),
            takeUntil(this.ngDestroy$)
        );
    }

    ngOnDestroy() {
        this.ngDestroy$.next();

        if (this.licenseNumError$) {
            this.licenseNumError$.unsubscribe();
        }
    }
}

export interface LicenseInfoUpdateObj {
    licenseStatus: LicenseStatus;
    licenseStatusValue: string;
    ownInsuranceApprovedExt: boolean;
    licenseNumber: string;
    licenseState: string;
    yearsLicensed: LicenseYears;
    yearsLicensedValue: string;
}
