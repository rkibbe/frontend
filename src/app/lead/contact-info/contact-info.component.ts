import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription, Subject } from 'rxjs';
import { NavigationService } from '@app/core/services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take } from 'rxjs/operators';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { phoneValidator } from '@shared/validators/phone-validator';
import { EmailFormatter } from '@shared/formatters/email-formatter';
import { emailValidator } from '@shared/validators/email-validator';
import { DataLayerService } from '@app/core/services/data-layer.service';
import { AppSettings } from '@app/shared/settings/app-settings';
import { AppSettingsService } from '@app/core/services/app-settings.service';

@Component({
    selector: 'verti-contact-info',
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
    contactForm: FormGroup;
    contactForm$: Subscription;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    loaderStopped: boolean;
    showEmailError: boolean;
    showPhoneError: boolean;
    appSettings: AppSettings;

    private ngDestroy$ = new Subject();

    private _showPhonePrefix = false;
    get showPhonePrefix(): boolean {
        // return this._showPhonePrefix || !!this.phoneNumber.value;
        return this._showPhonePrefix || !!this.contactForm.get('phoneNumber').value;
    }
    set showPhonePrefix(show: boolean) {
        this._showPhonePrefix = show;
    }

    constructor(
        private fb: FormBuilder,
        public phoneFormatter: PhoneFormatter,
        public emailFormatter: EmailFormatter,
        private store: Store<any>,
        private navService: NavigationService,
        private dataLayerService: DataLayerService,
        private appSettingService: AppSettingsService
    ) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    ngOnInit() {
        this.contactForm = this.fb.group({
            primaryEmailAddress: ['', Validators.compose([Validators.required, emailValidator])],
            phoneNumber: ['', phoneValidator(this.phoneFormatter)]
        });

        this.contactForm$ = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe(leadData => {
                if (leadData) {
                    leadData.phoneNumber =
                        (leadData.phoneNumber && this.phoneFormatter.format(leadData.phoneNumber)) || '';
                    this.contactForm.patchValue(leadData);
                }
            });
        this.navService.upDateMarketingData();
    }

    onEmailBlur() {
        this.showEmailError = this.contactForm.get('primaryEmailAddress').hasError('email');
    }

    onPhoneBlur() {
        this.showPhonePrefix = !!this.contactForm.get('phoneNumber').value;
        this.showPhoneError = this.contactForm.get('phoneNumber').hasError('phone');
    }
    onPhoneFocus(): void {
        this.showPhonePrefix = true;
    }

    saveDetails(): void {
        const conatctValObj = this.contactForm.value;
        conatctValObj.phoneNumber = this.phoneFormatter.removeUnimportantChars(
            this.contactForm.get('phoneNumber').value
        );

        this.store.dispatch(new LeadActions.SavePNIData(conatctValObj));

        this.loaderStopped = false;

        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy() {
        if (this.contactForm$) {
            this.contactForm$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
