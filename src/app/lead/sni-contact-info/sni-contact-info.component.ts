import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddSNIAction } from '@app/store/actions/lead.actions';
import { Driver, Sni } from '@app/store/models/lead.model';
import * as selectors from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { EmailFormatter } from '@shared/formatters/email-formatter';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { emailValidator } from '@shared/validators/email-validator';
import { phoneValidator } from '@shared/validators/phone-validator';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-sni-contact-info',
    templateUrl: './sni-contact-info.component.html',
    styleUrls: ['./sni-contact-info.component.scss']
})
export class SniContactInfoComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;

    sniDriver: Driver;
    driver$: Subscription;

    showEmailError: boolean;
    showPhoneError: boolean;
    driverId: string;
    loaderSubscription: Subscription;
    loaderStopped: any;
    leadSub: Subscription;

    private ngDestroy$ = new Subject();

    get title() {
        if (this.sniDriver) {
            return `${this.sniDriver.firstName} ${this.sniDriver.lastName}'s contact info.`;
        }
        return 'Contact info.';
    }

    constructor(
        fb: FormBuilder,
        public phoneFormatter: PhoneFormatter,
        public emailFormatter: EmailFormatter,
        private store: Store<any>,
        private navService: NavigationService,
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(params => {
            this.driverId = params.id;
        });
        this.formGroup = fb.group({
            email: ['', Validators.compose([Validators.required, emailValidator])],
            phone: ['', Validators.compose([Validators.required, phoneValidator(phoneFormatter)])]
        });
    }

    ngOnInit() {
        // TODO get selected sni
        // this.driver$ = this.store
        //     .select(selectors.drivers)
        //     .subscribe(drivers => {
        //         this.driver = drivers && drivers.length && drivers[0];
        //         // TODO remove dummy data
        //         if (!this.driver) {
        //             this.dispatchDriver();
        //             this.driver$ = this.store.select(selectors.drivers)
        //                 .subscribe((d2) => {
        //                     this.driver = d2 && d2.length && d2[0];
        //                 });
        //         }
        //     });
        this.driver$ = this.store.select(selectors.includedDrivers).subscribe(drivers => {
            if (drivers && drivers.length && this.driverId) {
                this.sniDriver = drivers.filter(driver => driver.driverID === this.driverId)[0];
            }
        });
        this.store
            .select(selectors.sni)
            .pipe(take(1))
            .subscribe((sni: Sni) => {
                const sniData = sni;
                if (sniData && sniData.driverID === this.driverId) {
                    if (sniData.phone) {
                        sniData.phone = this.phoneFormatter.format(sniData.phone) || '';
                    }
                    this.formGroup.patchValue(sniData);
                }
            });
        this.navService.upDateMarketingData();
    }

    // Validation
    hasEmailError(): boolean {
        return this.formGroup.get('email').hasError('email');
    }

    hasPhoneError(): boolean {
        return this.formGroup.get('phone').hasError('phone');
    }

    // Event handlers
    onEmailBlur() {
        this.showEmailError = this.hasEmailError();
    }

    onPhoneBlur() {
        this.showPhoneError = this.hasPhoneError();
    }

    onSubmit() {
        console.log(this.formGroup.value);
        const sniContactForm = this.formGroup.value;
        sniContactForm.phone = this.phoneFormatter.removeUnimportantChars(this.formGroup.get('phone').value);
        const sniContact = {
            driverID: this.driverId,
            isSNISelected: true,
            ...this.formGroup.value
        };
        console.log(sniContact);
        this.store.dispatch(new AddSNIAction({ secondaryInsured: sniContact }));
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    onCancelClick() {
        this.navService.navigateBack();
    }
    ngOnDestroy() {
        if (this.driver$ && !this.driver$.closed) {
            this.driver$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
