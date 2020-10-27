import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { ErrorModalComponent } from '@shared/error-modal/error-modal.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
    selector: 'verti-product-not-found',
    templateUrl: './product-not-found.component.html',
    styleUrls: ['./product-not-found.component.scss']
})
export class ProductNotFoundComponent implements OnInit, OnDestroy {
    imgSource: string;
    title: string;
    noProductsFoundForm: FormGroup;
    emailPattern = /^[A-Za-z][A-Za-z0-9._-]+@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    noProductsFoundForm$: Subscription;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    errorSubscription: Subscription;
    errorOccured: boolean;
    count: number;
    invalidEmail: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private store: Store<any>,
        private navService: NavigationService
    ) {
        this.imgSource = './assets/img/Icon_nocovermap.svg';
        this.title = `We don't cover your area.`;
        // this.title = 'Contact information.';
        this.count = 0;
        this.errorOccured = false;
        this.invalidEmail = false;
    }

    ngOnInit() {
        this.noProductsFoundForm = this.fb.group({
            // email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
            primaryEmailAddress: [
                '',
                Validators.compose([
                    // Validators.minLength(1),
                    Validators.maxLength(50),
                    Validators.required,
                    Validators.pattern(this.emailPattern)
                ])
            ]
        });
    }

    onEmailBlur() {
        const emailCheck = this.noProductsFoundForm.get('primaryEmailAddress').value;
        if (emailCheck) {
            this.invalidEmail = this.noProductsFoundForm.get('primaryEmailAddress').hasError('pattern');
        } else {
            this.invalidEmail = false;
        }
    }

    validateEmail(controlName) {
        const value = this.noProductsFoundForm.get(controlName).value;
        if (value !== '') {
            const str = value.replace(/[^a-zA-Z0-9_\-\.\@]/g, '');
            this.noProductsFoundForm.get(controlName).patchValue(str);
        }
    }
    getUpdates(): void {
        this.store.dispatch(new LeadActions.SavePNIData(this.noProductsFoundForm.value));
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.store.dispatch(new LeadActions.PostLeadAction(leadData));
            });
        this.dialog.open(ErrorModalComponent, {
            data: {
                imgSource: './assets/img/Icon_nocovermap.svg',
                title: `Thanks! We’ll keep you updated.`,
                body: `Look for an update once Verti has launched in your neighborhood.`
            },
            panelClass: 'custom-error-modal'
        });
    }

    ngOnDestroy() {
        if (this.noProductsFoundForm$) {
            this.noProductsFoundForm$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
    }
}
