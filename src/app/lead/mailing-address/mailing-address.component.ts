import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NavigationService } from '@services/navigation.service';
import { AddressInputLabelConfig } from '@shared/address-input/address-input.component';
import { Address, Lead, PrimaryAddress, MailingAddress } from '@app/store/models/lead.model';
import { leadSelector } from '@app/store/reducers/lead.reducers';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
@Component({
    selector: 'verti-residential-confirmation',
    templateUrl: './mailing-address.component.html',
    styleUrls: ['./mailing-address.component.scss']
})
export class MailingAddressComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public residentialControl: FormControl;
    public addressControl: FormControl;

    public showAddressForm = false;

    public addressLabelConfig: AddressInputLabelConfig = {
        autofill: {
            main: 'Mailing address'
        }
    };

    public primaryAddress: Address;
    mailingAddress: Address;
    private ngDestroy$ = new Subject();
    loaderSubscription: Subscription;
    loaderStopped: boolean;
    leadSub: Subscription;
    constructor(private store: Store<any>, private navService: NavigationService) { }

    ngOnInit() {
        this.buildForm();
        this.store
            .select(leadSelector)
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe((lead: Lead) => {
                this.primaryAddress = this.primaryAddressToAddress(lead.primaryAddress);
                if (lead.quote && lead.quote.mailingAddress) {
                    this.mailingAddress = this.mailingAddressToAddress(lead.quote.mailingAddress);
                    const updateMailingAddress = lead.quote.updateMailingAddress ? 'N' : 'Y';
                    this.residentialControl.setValue(updateMailingAddress);
                    if (updateMailingAddress === 'N') {
                        this.addressControl.setValue(this.mailingAddress);
                        this.onButtonToggleClick(updateMailingAddress);
                    }
                } else {
                    const updateMailingAddress = lead.quote.updateMailingAddress;
                    if (updateMailingAddress === false) {
                        this.residentialControl.setValue('Y');
                    }
                }
            });
    }

    private primaryAddressToAddress(primaryAddress: PrimaryAddress): Address {
        return {
            addressLine1: primaryAddress.addressLine1,
            addressLine2: primaryAddress.addressLine2,
            city: primaryAddress.city,
            state: primaryAddress.state,
            postalCode: primaryAddress.postalCode,
            county: primaryAddress.county,
            country: primaryAddress.country
        };
    }
    private mailingAddressToAddress(mailingAddress: MailingAddress): Address {
        return {
            addressLine1: mailingAddress.addressLine1,
            addressLine2: mailingAddress.addressLine2,
            city: mailingAddress.city,
            state: mailingAddress.state,
            postalCode: mailingAddress.postalCode,
            county: mailingAddress.county,
            country: mailingAddress.country
        };
    }
    private buildForm(): void {
        this.residentialControl = new FormControl(null, Validators.required);
        this.addressControl = new FormControl(null, Validators.required);
        this.form = new FormGroup({
            address: this.addressControl
        });
    }

    public onButtonToggleClick(value: string) {
        this.navService.upDateMarketingData();
        if (value === 'Y') {
            this.showAddressForm = false;
            this.updateBackEndFlag(false);
            this.navService.navigate();
        } else if (value === 'N') {
            this.showAddressForm = true;
            this.updateBackEndFlag(true);
        }
    }
    public onSubmit(): void {
        (this.addressControl.value as Observable<Address>).subscribe(address => {
            this.saveMailingAddess(address);
        });
    }
    updateBackEndFlag(value) {
        const backEndFlags = {
            updateMailingAddress: value
        };
        this.store.dispatch(new LeadActions.SaveQuote(backEndFlags));
    }
    saveMailingAddess(address) {
        this.store.dispatch(new LeadActions.SaveQuote({ mailingAddress: address }));
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
