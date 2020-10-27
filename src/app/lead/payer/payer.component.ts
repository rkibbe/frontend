import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Address, Lead, PayerInfo } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { AddressInputLabelConfig } from '@shared/address-input/address-input.component';
import { EmailFormatter } from '@shared/formatters/email-formatter';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { emailValidator } from '@shared/validators/email-validator';
import { phoneValidator } from '@shared/validators/phone-validator';
import { Observable, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'verti-payer',
    templateUrl: './payer.component.html',
    styleUrls: ['./payer.component.scss']
})
export class PayerComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public payerConfirmControl: FormControl;
    public controlNames: any = {
        firstName: 'firstName',
        lastName: 'lastName',
        address: 'primaryAddress',
        email: 'emailAddress1',
        phone: 'cellNumber'
    };

    public showPayerForm = false;

    public addressLabelConfig: AddressInputLabelConfig = {
        autofill: {
            main: 'Billing address'
        }
    };

    private _showPhoneError = false;
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    public get showPhoneError(): boolean {
        return this._showPhoneError && this.control(this.controlNames.phone).hasError('phone');
    }
    public set showPhoneError(show: boolean) {
        this._showPhoneError = show;
    }

    private _showEmailError = false;
    public get showEmailError(): boolean {
        return this._showEmailError && this.control(this.controlNames.email).hasError('email');
    }
    public set showEmailError(show: boolean) {
        this._showEmailError = show;
    }

    private ngDestroy$ = new Subject();

    constructor(
        public emailFormatter: EmailFormatter,
        public phoneFormatter: PhoneFormatter,
        private store: Store<any>,
        private navService: NavigationService
    ) {
    }

    public ngOnInit(): void {
        this.buildForm();
        this.store
            .select(fromStore.leadSelector)
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe((lead: Lead) => {
                if (lead.quote && lead.quote.payerInfoAddress) {
                    const updatePayerInfoAddress = lead.quote.updatePayerInfoAddress ? 'N' : 'Y';
                    this.payerConfirmControl.setValue(updatePayerInfoAddress);
                    if (updatePayerInfoAddress === 'N') {
                        this.form.patchValue(lead.quote.payerInfoAddress);
                        this.form.controls.cellNumber.patchValue(
                            this.phoneFormatter.format(lead.quote.payerInfoAddress.cellNumber)
                        );
                        this.onButtonToggleClick(updatePayerInfoAddress);
                    }
                } else {
                    const updatePayerInfoAddress = lead.quote.updatePayerInfoAddress;
                    if (updatePayerInfoAddress === false) {
                        this.payerConfirmControl.setValue('Y');
                    }
                }
            });
    }

    private buildForm(): void {
        this.payerConfirmControl = new FormControl(null, Validators.required);
        this.form = new FormGroup({
            [this.controlNames.firstName]: new FormControl(null, Validators.required),
            [this.controlNames.lastName]: new FormControl(null, Validators.required),
            [this.controlNames.address]: new FormControl(null, Validators.required),
            [this.controlNames.email]: new FormControl(null, [Validators.required, emailValidator]),
            [this.controlNames.phone]: new FormControl(null, [Validators.required, phoneValidator(this.phoneFormatter)])
        });
    }

    public control(controlName: string): FormControl {
        return this.form.get(controlName) as FormControl;
    }

    public onButtonToggleClick(value: string, manual?): void {
        this.navService.upDateMarketingData();
        if (value === 'Y') {
            this.showPayerForm = false;
            this.updateBackEndFlag(false);
            this.navService.navigate();
        } else if (value === 'N') {
            this.showPayerForm = true;
            this.updateBackEndFlag(true);
        }
        if (manual) {
            this.navService.paymentCallBackCompleted = false;
        }
    }

    private updateBackEndFlag(value: boolean): void {
        let backEndFlags = {};
        if (value) {
            backEndFlags = {
                updatePayerInfoAddress: value,
                updateBillingAddress: false
            };
        } else {
            backEndFlags = {
                updatePayerInfoAddress: value
            };
        }
        this.store.dispatch(new LeadActions.SaveQuote(backEndFlags));
    }

    public onPhoneBlur(): void {
        this.showPhoneError = this.control(this.controlNames.phone).hasError('phone');
    }

    public onEmailBlur(): void {
        this.showEmailError = this.control(this.controlNames.email).hasError('email');
    }

    public onSubmit(): void {
        (this.control(this.controlNames.address).value as Observable<Address>).subscribe(address => {
            this.savePayerInfo(address);
        });
        this.navService.paymentCallBackCompleted = false;
    }

    private savePayerInfo(address: Address): void {
        const payerInfoAddress: PayerInfo = {
            firstName: this.form.value.firstName.trim(),
            lastName: this.form.value.lastName.trim(),
            emailAddress1: this.form.value.emailAddress1.trim(),
            cellNumber: this.phoneFormatter.removeUnimportantChars(this.form.value.cellNumber),
            primaryAddress: address
        };
        const location = window.location;
        const evoToken = {
            returnURL: location.origin + '' + location.pathname + '/#tokenconfirm&tokenconfirmed=true',
            cancelURL: location.origin + '' + location.pathname + '/#payer'
        };
        this.store.dispatch(new LeadActions.SaveQuote({ payerInfoAddress }));
        this.store.dispatch(new LeadActions.SaveQuote({ evoToken }));
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
