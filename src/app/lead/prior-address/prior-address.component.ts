import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as LeadActions from '@app/store/actions/lead.actions';
import { StartLoaderAction, StopLoaderAction } from '@app/store/actions/loader.actions';
import { Address, PriorAddress } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { GooglePredictionService } from '@services/google-prediction.service';
import { NavigationService } from '@services/navigation.service';
import { SplunkService } from '@services/splunk.service';
import { AddressInputLabelConfig } from '@shared/address-input/address-input.component';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { EMPTY, Observable, Subject, zip } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
@Component({
    selector: 'verti-prior-address',
    templateUrl: './prior-address.component.html'
})
export class PriorAddressComponent implements OnInit, AfterViewInit, OnDestroy {
    public form: FormGroup;

    public placeHolderConfig: AddressInputLabelConfig = {
        autofill: {
            main: 'Street address, city, state'
        }
    };

    public get addressControl(): FormControl {
        return this.form.get('address') as FormControl;
    }

    public isQuoteCreated = false;
    public leadFlowQQAvailable: boolean;
    leadId: string;
    private ngDestroy$ = new Subject();

    constructor(
        private store: Store<any>,
        private navService: NavigationService,
        private googlePredictionService: GooglePredictionService,
        private dialog: MatDialog,
        private splunkService: SplunkService,
        private dataLayerService: DataLayerService,
        private addressPipe: AddressPipe
    ) {}

    ngOnInit() {
        this.buildForm();
        this.initializeData();
    }

    ngAfterViewInit() {
        this.navService.upDateMarketingData();
    }

    private buildForm() {
        this.form = new FormGroup({
            address: new FormControl(null, Validators.required),
            timeAtCurrentResidenceCode: new FormControl(true)
        });
    }

    private initializeData(): void {
        zip(this.store.select(fromStore.priorAddress), this.store.select(fromStore.isQuoteCreatedSelector))
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(([priorAddress, isQuoteCreated]: [PriorAddress, boolean]) => {
                this.isQuoteCreated = isQuoteCreated;
                setTimeout(() => {
                    if (priorAddress) {
                        this.addressControl.setValue(this.mapPriorAddressToAddress(priorAddress));
                    }
                    this.googlePredictionService.seedLocationBias();
                });
            });
    }

    private mapPriorAddressToAddress(priorAddress: PriorAddress): Address {
        return {
            addressLine1: priorAddress.addressLine1,
            addressLine2: priorAddress.addressLine2,
            city: priorAddress.city,
            state: priorAddress.state,
            postalCode: priorAddress.postalCode,
            county: priorAddress.county,
            country: priorAddress.country,
            isAddressVerified: priorAddress.isAddressVerified,
            manualAddress: priorAddress.cantFindAddress
        };
    }

    private mapAddressToPriorAddress(address: Address): PriorAddress {
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
            addressType: 'priorExt'
        };
    }

    public saveDetails(): void {
        this.store.dispatch(new StartLoaderAction());

        (this.addressControl.value as Observable<Address>)
            .pipe(
                catchError(this.showTimeoutOrNavigate.bind(this)),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(verifiedAddress => {
                this.store.dispatch(new StopLoaderAction());
                this.toNextPage(verifiedAddress);
            });
    }

    private showTimeoutOrNavigate(error: Error): Observable<never> {
        this.store.dispatch(new StopLoaderAction());
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
        const priorAddress: PriorAddress = { ...this.mapAddressToPriorAddress(address) };

        this.store.dispatch(new LeadActions.SavePNIData({ priorAddress }));
        this.dataLayerService.pushToDataLayer({
            zipcode: priorAddress.postalCode ? priorAddress.postalCode : '',
            city: priorAddress.city
        });
    }

    toNextPage(address: Address) {
        this.addressControl.setValue(address);
        this.savePNIData(address);
        this.navService.saveLeadAndNavigate();
    }

    ngOnDestroy() {
        this.ngDestroy$.next();
    }
}
