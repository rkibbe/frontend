import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
    selector: 'verti-ko-question-three',
    templateUrl: './ko-question-three.component.html'
})
export class KoQuestionThreeComponent implements OnInit, OnDestroy {
    koQuestionThree: FormGroup;
    koTitle: string;
    koListTitle: string;
    koList: string[];
    koQuestionThree$: Subscription;
    imgSource: string;
    eligibilityAnswers;
    loaderStopped: boolean;
    private ngDestroy$ = new Subject();
    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private navService: NavigationService,
        private dataLayerService: DataLayerService
    ) {
        this.imgSource = './assets/img/Icon_driverlicense.svg';
        this.koTitle = `Is your driver’s license suspended/revoked currently or
    has it been in the last 5 years?`;
    }

    ngOnInit() {
        this.koQuestionThree = this.fb.group({
            licenseRevoked: ['', Validators.required]
        });

        this.koQuestionThree$ = this.store
            .select(fromStore.quoteSelector)
            .pipe(distinctUntilChanged())
            .subscribe(quote => {
                if (quote && quote.eligibilityAnswers) {
                    this.eligibilityAnswers = quote.eligibilityAnswers;
                    this.koQuestionThree.patchValue(this.eligibilityAnswers);
                }
            });
        this.navService.upDateMarketingData();
        this.dataLayerService.pushStepTotal(this.navService.currentRoute);
    }

    koQuestion() {
        this.store.dispatch(
            new LeadActions.SaveQuote({
                eligibilityAnswers: { ...this.eligibilityAnswers, ...this.koQuestionThree.value }
            })
        );
        this.loaderStopped = false;
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy() {
        if (this.koQuestionThree$) {
            this.koQuestionThree$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
