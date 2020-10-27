import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription, Subject } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
@Component({
    selector: 'verti-ko-question-one',
    templateUrl: './ko-question-one.component.html'
})
export class KoQuestionOneComponent implements OnInit, OnDestroy {
    koQuestionOne: FormGroup;
    koTitle: string;
    koList: string[];
    koQuestionOne$: Subscription;
    imgSource: string;
    eligibilityAnswers;
    loaderStopped: boolean;
    private ngDestroy$ = new Subject();
    constructor(private fb: FormBuilder, private store: Store<any>, private navService: NavigationService) {
        this.imgSource = './assets/img/Icon_rocket.svg';
        this.koTitle = `Listed below are vehicle types we don't insure. Does your quote need to include coverage for any of these?`;
        this.koList = [
            'Motorcycle',
            'Car/Truck built prior to 1981',
            'Custom vehicle or conversion van',
            'Motor home, recreational vehicle or travel trailer',
            'All-terrain vehicle (ATV)',
            'Salvaged & branded vehicles'
        ];
    }

    ngOnInit() {
        this.koQuestionOne = this.fb.group({
            ineligibleVehicle: ['', Validators.required]
        });

        this.koQuestionOne$ = this.store
            .select(fromStore.quoteSelector)
            .pipe(distinctUntilChanged())
            .subscribe(quote => {
                if (quote && quote.eligibilityAnswers) {
                    this.eligibilityAnswers = quote.eligibilityAnswers;
                    this.koQuestionOne.patchValue(this.eligibilityAnswers);
                }
            });
        this.navService.upDateMarketingData();
    }

    koQuestion() {
        this.store.dispatch(
            new LeadActions.SaveQuote({
                eligibilityAnswers: {
                    ...this.eligibilityAnswers,
                    ...this.koQuestionOne.value
                }
            })
        );

        this.loaderStopped = false;
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }
    ngOnDestroy() {
        if (this.koQuestionOne$) {
            this.koQuestionOne$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
