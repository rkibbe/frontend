import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { } from 'googlemaps';
import { EMPTY, Observable, Subject, zip, Subscription } from 'rxjs';
import { catchError, switchMap, take, takeUntil } from 'rxjs/operators';
import { ProductsListService } from 'src/app/core/services/products-list.service';
import { TrilliumAddressService } from 'src/app/core/services/trillium-address.service';
import { DataLayerService } from '@app/core/services/data-layer.service';
import { GooglePredictionService } from '@app/core/services/google-prediction.service';
import { NavigationService } from '@app/core/services/navigation.service';
import { SplunkService } from '@app/core/services/splunk.service';
import { AddressInputLabelConfig } from '@shared/address-input/address-input.component';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Address, MarketingData, PrimaryAddress, Lead, InputTypes } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { Project } from '@app/store/models/project.model';

@Component({
    selector: 'verti-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, AfterViewInit, OnDestroy {
    public addressForm: FormGroup;
    public placeHolderConfig: AddressInputLabelConfig = {
        autofill: {
            main: 'Street address, city, state'
        }
    };
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    project: Project;

    public get addressControl(): FormControl {
        return this.addressForm.get('address') as FormControl;
    }

    public get residenceControl(): FormControl {
        return this.addressForm.get('timeAtCurrentResidenceCode') as FormControl;
    }

    public isQuoteCreated = false;
    public isAutoComplete: boolean;
    private ngDestroy$ = new Subject();
    fields: any;
    constructor(
        private productListService: ProductsListService,
        private googlePredictionService: GooglePredictionService,
        private trilliumService: TrilliumAddressService,
        private store: Store<any>,
        private navService: NavigationService,
        private dialog: MatDialog,
        private splunkService: SplunkService,
        private dataLayerService: DataLayerService,
        private addressPipe: AddressPipe
    ) { }

    ngOnInit() {
        this.buildForm();
        this.initializeData();
    }

    ngAfterViewInit() {
        this.navService.upDateMarketingData();
    }

    private buildForm() {
        const formGroup = {};
        this.fields = this.navService.currentRouteObj.content.filter(elem => elem.visible);
        this.fields.forEach(element => {
            formGroup[element.attribute] = new FormControl(
                element.value,
                this.bindValidations(element.validations || [])
            );
        });
        this.addressForm = new FormGroup(formGroup);
    }
    bindValidations(validations: any) {
        if (validations.length > 0) {
            const validList = [];
            validations.forEach(valid => {
                validList.push(this.formValidators(valid));
            });
            return Validators.compose(validList);
        }
        return null;
    }
    formValidators(validator) {
        switch (validator.name) {
            case 'required':
                return Validators.required;
            case 'pattern':
                return Validators.pattern(validator.pattern);
        }
    }

    private initializeData(): void {
        zip(
            this.store.select(fromStore.primaryAddress),
            this.store.select(fromStore.isQuoteCreatedSelector),
            this.store.select(state => state.lead.marketingData),
            this.store.select(state => state.project)
        )
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(
                ([primaryAddress, isQuoteCreated, marketingData, project]: [
                    PrimaryAddress,
                    boolean,
                    MarketingData,
                    Project
                ]) => {
                    setTimeout(() => {
                        this.project = project;
                        if (primaryAddress) {
                            if (this.addressControl) {
                                this.addressControl.setValue(this.mapPrimaryAddressToAddress(primaryAddress));
                            }
                            if (this.residenceControl) {
                                if (this.getFormControlType('timeAtCurrentResidenceCode') === InputTypes.TEXT
                                ) {
                                    this.residenceControl.setValue(primaryAddress.timeAtCurrentResidenceCode);
                                } else {
                                    this.residenceControl.setValue(
                                        primaryAddress.timeAtCurrentResidenceCode !== 'lessThan2Months'
                                    );
                                }
                            }
                            this.isAutoComplete = primaryAddress.isAutoComplete;
                        }
                        if (this.residenceControl) {
                            if (isQuoteCreated) {
                                this.isQuoteCreated = true;
                                this.residenceControl.disable();
                            } else {
                                this.isQuoteCreated = false;
                                this.residenceControl.enable();
                            }
                        }

                        if (marketingData.zipCode) {
                            this.googlePredictionService.seedLocationBias(marketingData.zipCode);
                        } else {
                            this.googlePredictionService.seedLocationBias();
                        }
                    });
                }
            );
    }
    getFormControlType(name) {
        return this.fields.find(elm => elm.attribute === name).type;
    }
    private mapPrimaryAddressToAddress(primaryAddress: PrimaryAddress): Address {
        return {
            addressLine1: primaryAddress.addressLine1,
            addressLine2: primaryAddress.addressLine2,
            city: primaryAddress.city,
            state: primaryAddress.state,
            postalCode: primaryAddress.postalCode,
            county: primaryAddress.county,
            country: primaryAddress.country,
            isAddressVerified: primaryAddress.isAddressVerified,
            manualAddress: primaryAddress.isAutoComplete === false ? true : primaryAddress.cantFindAddress,
            isAutoComplete: primaryAddress.isAutoComplete
        };
    }

    private mapAddressToPrimaryAddress(address: Address, residenceLength: boolean | string): PrimaryAddress {
        let timeAtCurrentResidenceCode, timeAtCurrentResidenceValue;
        if (this.getFormControlType('timeAtCurrentResidenceCode') === InputTypes.TEXT
        ) {
            timeAtCurrentResidenceCode = timeAtCurrentResidenceValue = +residenceLength;
        } else {
            timeAtCurrentResidenceCode = residenceLength ? 'greaterThan2Months' : 'lessThan2Months';
            timeAtCurrentResidenceValue = residenceLength ? 'Greater than 2 months' : 'Less than 2 months';
        }
        return {
            displayName: this.addressPipe.transform(address),
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            county: address.county,
            country: address.country,
            isAddressVerified: address.isAddressVerified,
            cantFindAddress: address.manualAddress,
            timeAtCurrentResidenceCode: timeAtCurrentResidenceCode,
            timeAtCurrentResidenceValue: timeAtCurrentResidenceValue,
            isAutoComplete: this.isAutoComplete
        };
    }

    public saveDetails(): void {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        let enteredAddress;
        (this.addressControl.value as Observable<Address>)
            .pipe(
                catchError(this.showTimeoutOrNavigate.bind(this)),
                switchMap(address => {
                    enteredAddress = address;
                    return this.productListService.productListService(address.postalCode);
                }),
                catchError(this.showTimeoutOrNavigate.bind(this)),
                switchMap(product => this.goToNotInAreaOrVerifyAddress(product, enteredAddress)),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(
                verifiedAddress => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.toNextPage(verifiedAddress);
                },
                error => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.splunkService.log(error);
                    console.error(error);
                    enteredAddress.isAddressVerified = false;
                    this.toNextPage(enteredAddress);
                }
            );
    }

    private goToNotInAreaOrVerifyAddress(product: string, address: Address): Observable<Address> {
        this.store.dispatch(new LoaderActions.StopLoaderAction());
        if (product === 'Product Not Found') {
            this.savePNIData(address);
            this.navService.gotoRouteByName('notinyourarea');
            return EMPTY;
        } else if (product === 'Product Found' && !this.isQuoteCreated) {
            return this.trilliumService.verifyAddress(address);
        }
        this.toNextPage(address);
        return EMPTY;
    }

    private showTimeoutOrNavigate(error: Error): Observable<never> {
        this.store.dispatch(new LoaderActions.StopLoaderAction());
        this.splunkService.log(error);
        console.error(error);
        this.navService.numOfTimesErrorOccurredOnScreen++;

        // TODO ask why pni is saved on error
        // this.savePNIData();

        if (this.navService.numOfTimesErrorOccurredOnScreen < 4) {
            this.dialog.open(TimeoutModalComponent, {
                panelClass: 'custom-timeout-modal'
            });
        } else {
            this.navService.gotoRouteByName('systemfailure');
        }
        return EMPTY;
    }

    savePNIData(address: Address) {
        const primaryAddress: PrimaryAddress = {
            ...this.mapAddressToPrimaryAddress(address, this.residenceControl.value)
        };

        this.store.dispatch(new LeadActions.SavePNIData({ primaryAddress }));
        this.dataLayerService.pushToDataLayer({
            zipcode: primaryAddress.postalCode ? primaryAddress.postalCode : '',
            city: primaryAddress.city
        });
    }

    toNextPage(address: Address) {
        this.addressControl.setValue(address);
        this.savePNIData(address);
        this.saveLeadAndNavigate();
    }
    saveLeadAndNavigate() {
        this.loaderStopped = false;
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
    ngOnDestroy() {
        this.ngDestroy$.next();
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
