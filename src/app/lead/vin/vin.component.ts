import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as LeadActions from '@app/store/actions/lead.actions';
import { UpdateCustomQuoteAction, UpdateGenerateQuickQuotePriceFlag } from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Lead, TitleHolder, Vehicle } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { NavigationService } from '@services/navigation.service';
import { VinDetailsService } from '@services/vin-details.service';
import { AppSettings } from '@shared/settings/app-settings';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'verti-vin',
    templateUrl: './vin.component.html',
    styleUrls: ['./vin.component.scss']
})
export class VINComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() optional: boolean;
    readonly imgSource = 'assets/img/VIN_Icon.svg';
    title = `What’s your vehicle’s unique ID number (VIN)?`;
    private ngDestroy$ = new Subject();
    VINData: Vehicle[];
    profileForm: FormGroup;
    vehcilesIncluded$: Subscription;
    // @ViewChild('scanner')
    // scanner: ZXingScannerComponent;
    hasCameras = false;
    hasPermission: boolean;
    availableDevices: MediaDeviceInfo[];
    selectedDevice: any;
    scannerEnabled = true;
    repeatedVin: boolean;
    currentVehicleId: any;
    previousVIN: string;
    leadSub: Subscription;
    loaderSubscription: any;
    loaderStopped: boolean;
    invalidVin: boolean;
    inCompleteVin: boolean;
    invalidVinRes: boolean;
    appSettings: AppSettings;
    os: string;
    browser: string;
    isCTAEnabled: boolean;
    leasedLoanVehicles: Vehicle[];
    placeHolder: string;
    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        public dialog: MatDialog,
        private navService: NavigationService,
        private vinDetailsService: VinDetailsService,
        private deviceDetectorService: DeviceDetectorService,
        private appSettingService: AppSettingsService,
        private activatedRoute: ActivatedRoute
    ) {
        this.invalidVin = false;
        this.inCompleteVin = false;
        this.isCTAEnabled = false;
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
        this.activatedRoute.paramMap.pipe(takeUntil(this.ngDestroy$)).subscribe(params => {
            const param = params.get('id');
            this.isCTAEnabled = param === 'true';
            if (this.isCTAEnabled) {
                this.title = 'Get a more accurate price by entering your VIN';
                this.placeHolder = 'VIN (Optional)';
            } else {
                this.placeHolder = 'VIN';
            }
        });
    }
    ngOnInit() {
        this.vehcilesIncluded$ = this.store
            .select(fromStore.includedVehicles)
            .pipe(take(1))
            .subscribe(vehicles => {
                this.VINData = [...vehicles];
                /* each vehicle's vehicleID becomes formcontrolname and respective VIN becomes value*/
                if (this.navService.currentRouteObj.preFill) {
                    this.profileForm = this.fb.group(
                        this.VINData.reduce(
                            (acc, curr: Vehicle) => ({ ...acc, [curr.vehicleID]: !curr.isStubbedVin ? curr.vin : '' }),
                            {}
                        )
                    );
                } else {
                    this.profileForm = this.fb.group(
                        this.VINData.reduce((acc, curr) => ({ ...acc, [curr['vehicleID']]: '' }), {})
                    );
                }
                /* Validators added to each fromcontrolname */
                if (!this.isCTAEnabled) {
                    Object.keys(this.profileForm.controls).forEach((key: string) => {
                        this.profileForm.controls[key].setValidators([Validators.required, Validators.minLength(17)]);
                        this.profileForm.controls[key].updateValueAndValidity();
                    });
                }
                this.leasedLoanVehicles = vehicles.filter(vehicle =>
                    [TitleHolder.LEASE, TitleHolder.LOAN].includes(vehicle.titleHolder)
                );
            });
        this.navService.upDateMarketingData();
    }

    isRepeatedVin(controlName) {
        return this.controlHasError(controlName, 'repeatedvin');
    }

    isInvalidVin(controlName) {
        return this.controlHasError(controlName, 'invalidvin');
    }

    isCompleteVin(controlName) {
        return this.controlHasError(controlName, 'incompletevin');
    }
    isInvalidVinRes(controlName) {
        return this.controlHasError(controlName, 'invalidVinRes');
    }
    controlHasError(controlName: string, errorName: string): boolean {
        return this.profileForm.controls[controlName] && this.profileForm.controls[controlName].hasError(errorName);
    }

    showHint(controlName) {
        if (this.profileForm && this.profileForm.controls[controlName].value) {
            return (
                this.profileForm.controls[controlName].value.length !== 17 &&
                this.profileForm.controls[controlName].value.length !== 0
            );
        }
    }
    ngAfterViewInit() {}

    enteredVINInput(vehicleID) {
        const VIN = this.profileForm.controls[vehicleID].value;
        this.currentVehicleId = vehicleID;
        if (VIN.length === 17) {
            this.handleCode39Result(VIN);
            this.inCompleteVin = false;
        } else if (VIN.length > 0) {
            this.inCompleteVin = true;
        }
    }

    handleCode39Result(resultString: string) {
        this.scannerEnabled = false;
        this.repeatedVin = false;
        this.profileForm.get(this.currentVehicleId).setValue(resultString);
        /* Checks if VIN is already present */
        Object.keys(this.profileForm.controls).forEach((vehicleID: string) => {
            const VIN = this.profileForm.controls[vehicleID].value;
            if (resultString === VIN && vehicleID !== this.currentVehicleId) {
                const control = this.profileForm.controls[this.currentVehicleId];
                control.setErrors({
                    repeatedvin: true
                });
                if (!control.touched) {
                    control.markAsTouched();
                }
                this.profileForm.updateValueAndValidity();
                this.repeatedVin = true;
                this.invalidVin = false;
            }
        });
        if (!this.repeatedVin) {
            this.previousVIN = resultString;
            // to avoid calling POLK service consecutive
            const index = this.findIndexByVehicleID(this.currentVehicleId);
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            this.vinDetailsService.getVINDetails(resultString).subscribe(
                res => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    if (res && !res.error && Object.keys(res).length) {
                        this.VINData[index] = {
                            ...this.VINData[index],
                            ...res,
                            iconExisted: this.checkBodyStyleCode(res['bodyStyleCode']),
                            isStubbedVin: false
                        };
                        this.invalidVin = false;
                        this.invalidVinRes = false;
                        this.profileForm.controls[this.currentVehicleId].setErrors({
                            invalidvin: false
                        });
                    } else if (res && (res.error || !Object.keys(res).length)) {
                        this.invalidVinRes = true;
                        this.profileForm.controls[this.currentVehicleId].setErrors({
                            invalidVinRes: true
                        });
                        setTimeout(() => {
                            this.profileForm.controls[this.currentVehicleId].setValue('');
                            this.profileForm.controls[this.currentVehicleId].setErrors({
                                invalidVinRes: true
                            });
                        }, 200);
                        this.profileForm.controls[this.currentVehicleId].markAsTouched();
                    } else {
                        this.setErrors();
                    }
                },
                error => {
                    this.setErrors();
                }
            );
        }
        if (this.invalidVin) {
            this.profileForm.controls[this.currentVehicleId].setErrors({
                invalidvin: true
            });
        }
    }
    setErrors() {
        this.store.dispatch(new LoaderActions.StopLoaderAction());
        const control = this.profileForm.controls[this.currentVehicleId];
        control.setErrors({
            invalidvin: true
        });
        if (!control.touched) {
            control.markAsTouched();
        }
        this.invalidVin = true;
    }
    checkBodyStyleCode(bodyStyleCode) {
        if (bodyStyleCode) {
            return this.appSettings.VEHICLE_BODY_STYLES.includes(bodyStyleCode.trim());
        }
    }
    saveDetails() {
        this.loaderStopped = false;
        const formData = this.profileForm.controls;
        /* Filled VIN details added to respective Vehicles  */
        Object.keys(formData).forEach((vehicleID: string) => {
            const index = this.findIndexByVehicleID(vehicleID);
            if (!formData[vehicleID].errors && formData[vehicleID].value) {
                this.VINData[index]['vinPrefix'] = formData[vehicleID].value;
                this.VINData[index] = { ...this.VINData[index], isStubbedVin: false };
            } else {
                this.VINData[index] = { ...this.VINData[index], isStubbedVin: true };
            }
            this.VINData[index] = { ...this.VINData[index], isQuoteVehicle: true };
        });
        if (!this.isCTAEnabled && !this.leasedLoanVehicles.length) {
            this.updateBackendFlags(true);
        } else {
            this.updateBackendFlags(false);
        }
        this.store.dispatch(new LeadActions.UpdateAllVehicles(this.VINData));
        this.navService.currentRouteObj.preFill = true;

        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.store.dispatch(new LeadActions.PostLeadAction(leadData));
            });
        this.loaderSubscription = this.store
            .select(state => state.loader.isLoading)
            .subscribe(loading => {
                if (!loading && !this.loaderStopped) {
                    if (this.leadSub) {
                        this.leadSub.unsubscribe();
                    }
                    this.loaderStopped = true;
                    this.navService.navigate();
                }
            });
    }
    updateBackendFlags(value) {
        this.store.dispatch(
            new UpdateGenerateQuickQuotePriceFlag({
                rateQuote: value,
                finalizeQuote: value
            })
        );
        if (value) {
            this.store.dispatch(
                new UpdateCustomQuoteAction({
                    isQuoteCustomized: false,
                    fullQuote: true
                })
            );
        }
    }
    findIndexByVehicleID(vehicleID) {
        return this.VINData.findIndex(vehicle => vehicle['vehicleID'] === vehicleID);
    }
    isValidVin(vehicleId) {
        return this.profileForm.get(vehicleId).valid;
    }
    ngOnDestroy() {
        if (this.vehcilesIncluded$) {
            this.vehcilesIncluded$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
    isFormValid() {
        return !this.VINData.filter(vehicle => vehicle['vin'] === undefined).length && !this.invalidControls().length;
    }
    invalidControls() {
        return this.VINData.filter(vehicle => {
            const formControl = this.profileForm.get(vehicle['vehicleID']);
            if (
                formControl.hasError('invalidvin') ||
                formControl.hasError('repeatedvin') ||
                formControl.hasError('incompletevin') ||
                formControl.hasError('required') ||
                formControl.hasError('minlength') ||
                formControl.hasError('invalidVinRes')
            ) {
                return vehicle;
            }
        });
    }
}
