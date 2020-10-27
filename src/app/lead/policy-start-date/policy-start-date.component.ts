import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as LeadActions from '@app/store/actions/lead.actions';
import { PeriodStartDate } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-policy-start-date',
    templateUrl: './policy-start-date.component.html',
    styleUrls: ['./policy-start-date.component.scss']
})
export class PolicyStartDateComponent implements OnInit, OnDestroy {
    public readonly TITLE = `When would you like your policy to start?`;

    public calenderForm: FormGroup;

    public minDate: Date;
    public maxDate: Date;
    phoneNum: string;
    private policyStartDate: PeriodStartDate;

    private ngDestroy$ = new Subject();

    constructor(private fb: FormBuilder, private store: Store<any>, private navService: NavigationService) {
        this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe(lead => {
                if (lead && lead.quickQuote) {
                    this.policyStartDate = lead.quickQuote.periodStartDate;
                }
                this.phoneNum = lead.phoneNumber;
            });
    }

    ngOnInit() {
        this.calenderForm = this.fb.group({
            startDate: ['', Validators.required]
        });

        const myDate = new Date();
        const date = myDate.getDate();
        const month = myDate.getMonth();
        const year = myDate.getFullYear();

        this.minDate = new Date(year, month, date);
        this.maxDate = new Date(year, month, date + 60);

        if (
            this.policyStartDate.year &&
            this.policyStartDate.month &&
            this.policyStartDate.day &&
            this.navService.currentRouteObj.preFill
        ) {
            this.calenderForm
                .get('startDate')
                .patchValue(
                    new Date(this.policyStartDate.year, this.policyStartDate.month - 1, this.policyStartDate.day)
                );
        }
        this.navService.upDateMarketingData();
    }

    public saveDetails() {
        if (!this.phoneNum) {
            this.store.dispatch(new LeadActions.UpdateGenerateQuickQuotePriceFlag({ rateQuote: false, validateRules: false }));
        }
        const policyStartDate = this.calenderForm.get('startDate').value;
        const periodStartDate = {
            year: policyStartDate.getFullYear(),
            month: policyStartDate.getMonth() + 1,
            day: policyStartDate.getDate()
        };

        this.store.dispatch(new LeadActions.UpdatePolicyStartDateAction(periodStartDate));

        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy() {
        this.ngDestroy$.next();
    }
}
