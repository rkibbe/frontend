import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { DateFormatter } from '@shared/formatters/date-formatter';
import { dateValidator } from '@shared/validators/date-validator';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';

@Component({
    selector: 'verti-pni-name',
    templateUrl: './pni-name.component.html',
    styleUrls: ['./pni-name.component.scss']
})
export class PNINameComponent implements OnInit, OnDestroy, AfterViewInit {
    profileForm: FormGroup;

    readonly imgSource = './assets/img/Icon_HandWave.svg';
    readonly title = `Hi, we're Verti.\nWho are you?`;
    readonly genderOptions = { M: 'Male', F: 'Female' };

    profileForm$: Subscription;
    loaderSubscription: Subscription;
    leadSub: Subscription;

    dobInvalid: boolean;
    disableInput: boolean;
    loaderStopped: boolean;

    constructor(
        private fb: FormBuilder,
        private dateFormatter: DateFormatter,
        private store: Store<any>,
        private navService: NavigationService,
        private dataLayerService: DataLayerService
    ) { }

    ngOnInit() {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            DOB: ['', Validators.compose([Validators.required, dateValidator(this.dateFormatter)])],
            genderCode: ['', Validators.required]
        });

        this.profileForm$ = this.store
            .select(fromStore.leadSelector)
            .pipe(distinctUntilChanged())
            .subscribe((leadData: Lead) => {
                if (leadData) {
                    this.profileForm.patchValue(leadData);
                }
                if (leadData && leadData.dateOfBirth) {
                    const dateOfBirth = leadData.dateOfBirth;
                    const dobString = this.dateFormatter.format(
                        ('00' + dateOfBirth.month).substr(-2, 2) +
                        ('00' + dateOfBirth.day).substr(-2, 2) +
                        ('0000' + dateOfBirth.year).substr(-4, 4)
                    );
                    this.profileForm.controls.DOB.patchValue(dobString);
                }
                if (leadData && leadData.quote) {
                    this.disableInput = !!leadData.quote.quoteNumber;
                }
            });
    }

    ngAfterViewInit() {
        this.navService.upDateMarketingData();
    }

    saveDetails(formData) {
        this.loaderStopped = false;

        this.dataLayerService.pushToDataLayer({
            gender: this.genderOptions[formData.genderCode],
            age: formData.DOB
        });
        this.store.dispatch(new LeadActions.SavePNIData(this.getPNIDataObjectFromFormData(formData)));

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

    getPNIDataObjectFromFormData(formData) {
        const formDataCopy = { ...formData };
        delete formDataCopy.DOB;

        const dob = this.dateFormatter.getUnformattedObject(formData.DOB, true);

        formDataCopy.dateOfBirth = {
            month: +dob.month,
            day: +dob.day,
            year: +dob.year
        };
        formDataCopy.firstName = this.toTitleCase(formDataCopy.firstName);
        formDataCopy.lastName = this.toTitleCase(formDataCopy.lastName);
        formDataCopy.genderValue = this.genderOptions[formDataCopy.genderCode];

        return formDataCopy;
    }
    private toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    ngOnDestroy() {
        if (this.profileForm$) {
            this.profileForm$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
