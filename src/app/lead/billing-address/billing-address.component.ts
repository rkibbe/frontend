import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';
import { NavigationService } from '@app/core/services/navigation.service';
import { AddressInputLabelConfig } from '@shared/address-input/address-input.component';
import { BillingAddress, Address, Lead } from '@app/store/models/lead.model';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take, takeUntil } from 'rxjs/operators';
@Component({
    selector: 'verti-billing-address',
    templateUrl: './billing-address.component.html',
    styleUrls: ['./billing-address.component.scss']
})
export class BillingAddressComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public residentialControl: FormControl;
    public addressControl: FormControl;

    public showAddressForm = false;
    billingAddress: Address;
    public addressLabelConfig: AddressInputLabelConfig = {
        autofill: {
            main: 'Billing address'
        }
    };

    private ngDestroy$ = new Subject();
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;

    constructor(private store: Store<any>, private navService: NavigationService) {
    }

    ngOnInit() {
        this.buildForm();
        this.store
            .select(fromStore.leadSelector)
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe((lead: Lead) => {
                if (lead.quote && lead.quote.billingAddress) {
                    this.billingAddress = this.billingAddressToAddress(lead.quote.billingAddress);
                    const updateBillingAddress = lead.quote.updateBillingAddress ? 'N' : 'Y';
                    this.residentialControl.setValue(updateBillingAddress);
                    if (updateBillingAddress === 'N') {
                        this.addressControl.patchValue(this.billingAddress);
                        this.onButtonToggleClick(updateBillingAddress);
                    }
                } else {
                    const updateBillingAddress = lead.quote.updateBillingAddress;
                    if (updateBillingAddress === false) {
                        this.residentialControl.setValue('Y');
                    }
                }
            });
    }
    private billingAddressToAddress(billingAddress: BillingAddress): Address {
        return {
            addressLine1: billingAddress.addressLine1,
            addressLine2: billingAddress.addressLine2,
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.postalCode,
            county: billingAddress.county,
            country: billingAddress.country
        };
    }
    private buildForm(): void {
        this.residentialControl = new FormControl(null, Validators.required);
        this.addressControl = new FormControl(null, Validators.required);
        this.form = new FormGroup({
            address: this.addressControl
        });
    }

    public onButtonToggleClick(value: string, manual?) {
        this.navService.upDateMarketingData();
        if (value === 'Y') {
            this.showAddressForm = false;
            this.updateBackEndFlag(false);
            this.updateEvoTokenInfo();
            this.navigateToNextPage();
        } else if (value === 'N') {
            this.showAddressForm = true;
            this.updateBackEndFlag(true);
        }
        if (manual) {
            this.navService.paymentCallBackCompleted = false;
        }
    }

    public onSubmit(): void {
        (this.addressControl.value as Observable<Address>).subscribe(address => {
            this.saveBillingAddess(address);
        });
        this.navService.paymentCallBackCompleted = false;
    }
    updateEvoTokenInfo() {
        const location = window.location;
        const evoToken = {
            returnURL: location.origin + '' + location.pathname + '/#tokenconfirm&tokenconfirmed=true',
            cancelURL: location.origin + '' + location.pathname + '/#payer'
        };
        this.store.dispatch(new LeadActions.SaveQuote({ evoToken }));
    }
    updateBackEndFlag(value) {
        const backEndFlags = {
            updateBillingAddress: value
        };
        this.store.dispatch(new LeadActions.SaveQuote(backEndFlags));
    }
    saveBillingAddess(address) {
        this.store.dispatch(new LeadActions.SaveQuote({ billingAddress: address }));
        this.updateEvoTokenInfo();
        this.navigateToNextPage();
    }
    private navigateToNextPage(): void {
        // TODO save address and navigate
        this.loaderStopped = false;
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.store.dispatch(new LeadActions.UpdateAddressAction(leadData));
            });
        this.loaderSubscription = this.store
            .select(appState => appState.loader.isLoading)
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

    ngOnDestroy(): void {
        this.ngDestroy$.next();
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
