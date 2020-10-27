import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as LoaderActions from '@app/store/actions/loader.actions';
import * as RecoverQuoteActions from '@app/store/actions/recover-quote.actions';
import { Route } from '@app/store/models/route.model';
import * as recoverQuoteStore from '@app/store/reducers/recover-quote.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { RecoverquoteService } from '@services/recoverquote.service';
import { DateFormatter } from '@shared/formatters/date-formatter';
import { EmailFormatter } from '@shared/formatters/email-formatter';
import { RecoverQuoteNotFoundModalComponent } from '@shared/recover-quote-not-found-modal/recover-quote-not-found-modal.component';
import { AppSettings } from '@shared/settings/app-settings';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { dateValidator } from '@shared/validators/date-validator';
import { emailValidator } from '@shared/validators/email-validator';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Lead } from 'src/app/store/models/lead.model';



@Component({
    selector: 'verti-recover-quote',
    templateUrl: './recover-quote.component.html',
    styleUrls: ['./recover-quote.component.scss']
})
export class RecoverQuoteComponent implements OnDestroy {
    readonly FIRST_NAME_LABEL = 'First name';
    readonly LAST_NAME_LABEL = 'Last name';
    readonly EMAIL_LABEL = 'Email';
    readonly DOB_LABEL = 'Date of birth (mm/dd/yyyy)';
    readonly ZIP_CODE_LABEL = 'Zip code';

    recoverQuoteForm: FormGroup;
    recoverQuoteSub: Subscription;
    get emailControl(): FormControl {
        return this.recoverQuoteForm.get('email') as FormControl;
    }

    get dobControl(): FormControl {
        return this.recoverQuoteForm.get('dob') as FormControl;
    }

    get zipCodeControl(): FormControl {
        return this.recoverQuoteForm.get('zipCode') as FormControl;
    }

    showEmailError: boolean;
    showDOBError: boolean;
    showZipCodeError: boolean;
    visibleRouteList: Route[];
    constructor(
        fb: FormBuilder,
        private store: Store<any>,
        public dateFormatter: DateFormatter,
        public emailFormatter: EmailFormatter,
        public dialog: MatDialog,
        private router: Router,
        private recoverquoteService: RecoverquoteService,
        private navService: NavigationService,
        private appSettings: AppSettings
    ) {
        this.recoverQuoteForm = fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, emailValidator])],
            dob: ['', Validators.compose([Validators.required, dateValidator(this.dateFormatter)])],
            zipCode: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
        });
        this.store
            .select(state => state.routes)
            .subscribe(routesState => {
                if (routesState && routesState.routes.length) {
                    this.visibleRouteList = routesState.routes.filter(item => item.visible === true);
                }
            });
        this.recoverQuoteSub = this.store
            .select(recoverQuoteStore.quoteSearchCriteria)
            .pipe(take(1))
            .subscribe((searchData) => {
                if (searchData) {
                    this.recoverQuoteForm.patchValue(searchData);
                }
            });
    }

    // Validation
    validateZipCode(value: string): void {
        const newVal = value && value.replace(/\D/g, '');
        if (newVal !== value) {
            this.zipCodeControl.setValue(newVal);
        }
    }

    onEmailBlur() {
        this.showEmailError = this.hasEmailError();
    }

    hasEmailError() {
        return this.emailControl.hasError('email');
    }

    onDOBBlur() {
        this.showDOBError = this.hasDOBError();
    }

    hasDOBError() {
        return this.hasInvalidDate() || this.hasDateOutOfRange();
    }

    hasInvalidDate() {
        return this.dobControl.hasError('invalidDate');
    }

    hasDateOutOfRange() {
        return this.dobControl.hasError('dateOutOfRange');
    }

    onZipCodeBlur() {
        this.showZipCodeError = this.hasZipCodeError();
    }

    hasZipCodeError() {
        return this.zipCodeControl.hasError('minlength');
    }

    // Button handlers
    onContinueClick() {
        console.log('continue');
        this.dialog.open(RecoverQuoteNotFoundModalComponent, {
            panelClass: 'quote-not-found-modal-panel'
        });
    }

    onStartNewQuoteClick() {
        if (this.visibleRouteList.length) {
            this.navService.gotoRouteByName(this.visibleRouteList[0].routeName);
        }
    }

    searchQuotes() {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        const recoverQuoteFormControls = this.recoverQuoteForm.controls;

        const dob = new Date(recoverQuoteFormControls.dob.value);
        const formatedDoB = dob.getFullYear() + '-' + this.formatDigit(dob.getMonth() + 1) + '-' + this.formatDigit(dob.getDate());

        const searchKey = {
            emailID: recoverQuoteFormControls.email.value,
            dob: formatedDoB,
            zipCode: recoverQuoteFormControls.zipCode.value,
            lastName: recoverQuoteFormControls.lastName.value,
            firstName: recoverQuoteFormControls.firstName.value
        };
        const searchCriteria = {
            lastName: recoverQuoteFormControls.lastName.value,
            firstName: recoverQuoteFormControls.firstName.value,
            email: recoverQuoteFormControls.email.value,
            dob: this.formatDigit(dob.getMonth() + 1) + '/' +
                this.formatDigit(dob.getDate()) + '/' + dob.getFullYear(),
            zipCode: recoverQuoteFormControls.zipCode.value,
        };
        this.store.dispatch(
            new RecoverQuoteActions.SetRecoverQuotesEARCHCriteriaAction(searchCriteria));
        this.recoverquoteService.getQuotes(searchKey)
            .subscribe((res: Lead) => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                const error = res.error;
                if (!error) {
                    this.store.dispatch(
                        new RecoverQuoteActions.SearchQuoteAction(res)
                    );
                    this.router.navigate(['quotes'], { queryParamsHandling: 'merge' });
                } else {
                    if (this.appSettings.PERSONAL_DATA_ALERT_CODES.includes(+error.code)) {
                        this.router.navigate(['personaldataalert']);

                    } else {
                        this.dialog.open(RecoverQuoteNotFoundModalComponent, {
                            panelClass: 'quote-not-found-modal-panel',
                            data: this.visibleRouteList[0].routeName
                        });
                    }
                }
            },
                (error) => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.dialog.open(TimeoutModalComponent, {
                        panelClass: 'verti-timeout-modal'
                    });
                });
    }

    formatDigit(digit) {
        let formatedDigit;
        if (digit.toString().length <= 1) {
            formatedDigit = '0' + digit.toString();
        } else {
            formatedDigit = digit.toString();
        }
        return formatedDigit;
    }

    ngOnDestroy() {
        if (this.recoverQuoteSub) {
            this.recoverQuoteSub.unsubscribe();
        }
    }
}
