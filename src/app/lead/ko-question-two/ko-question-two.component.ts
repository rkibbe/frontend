import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription, Subject } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
    selector: 'verti-ko-question-two',
    templateUrl: './ko-question-two.component.html'
})
export class KoQuestionTwoComponent implements OnInit, OnDestroy {
    koQuestionTwo: FormGroup;
    koTitle: string;
    koListTitle: string;
    koList: string[];
    koQuestionTwo$: Subscription;
    imgSource: string;
    eligibilityAnswers: any;
    loaderStopped: boolean;
    private ngDestroy$ = new Subject();
    constructor(private fb: FormBuilder, private store: Store<any>, private navService: NavigationService) {
        this.imgSource = './assets/img/Icon_Cop.svg';
        this.koTitle = 'In the last 5 years, have you been convicted of any major violations like:';
        this.koList = [
            'Driving under the influence of alcohol',
            'Drag racing',
            'Fleeing or eluding police',
            'Passing stopped school bus',
            'Reckless driving',
            'Vehicle assault/felony/homicide'
        ];
    }

    ngOnInit() {
        this.koQuestionTwo = this.fb.group({
            majorViolations: ['', Validators.required]
        });

        this.koQuestionTwo$ = this.store
            .select(fromStore.quoteSelector)
            .pipe(distinctUntilChanged())
            .subscribe(quote => {
                if (quote && quote.eligibilityAnswers) {
                    this.eligibilityAnswers = quote.eligibilityAnswers;
                    this.koQuestionTwo.patchValue(this.eligibilityAnswers);
                }
            });
        this.navService.upDateMarketingData();
    }

    koQuestion() {
        this.store.dispatch(
            new LeadActions.SaveQuote({
                eligibilityAnswers: { ...this.eligibilityAnswers, ...this.koQuestionTwo.value }
            })
        );
        this.loaderStopped = false;
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy() {
        if (this.koQuestionTwo$) {
            this.koQuestionTwo$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
