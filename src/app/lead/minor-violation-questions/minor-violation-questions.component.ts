import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/reducers';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription, Subject } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Lead } from '@app/store/models/lead.model';
import { DataLayerService } from '@services/data-layer.service';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'verti-minor-violation-questions',
    templateUrl: './minor-violation-questions.component.html',
    styleUrls: ['./minor-violation-questions.component.scss']
})
export class MinorViolationQuestionsComponent implements OnInit, OnDestroy {
    @HostBinding('class.verti-minor-violation-questions') mainClass = true;

    minorViolation: FormGroup;
    data;
    allViolationsList;
    koTitle: string;
    koListTitle: string;
    koList: string[];
    minorViolation$: Subscription;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    loaderStopped: boolean;
    isQuoteFinalized: boolean;
    leadId: string;
    isDriverHistoryLandingScreen: boolean;

    private ngDestroy$ = new Subject();

    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private navService: NavigationService,
        private dataLayerService: DataLayerService,
        private activatedRoute: ActivatedRoute
    ) {
        const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
        this.isDriverHistoryLandingScreen = false;
        this.leadId =
            queryParamMap.get('leadID') ||
            queryParamMap.get('LeadID') ||
            queryParamMap.get('LeadId') ||
            queryParamMap.get('leadId') ||
            queryParamMap.get('leadid');
        this.allViolationsList = [
            {
                formControl: 'noOfMovingViolations',
                subtitle: 'How many moving violations have you had?',
                listTitle: 'Common examples are:',
                list: [
                    'Speeding',
                    'Running a red light/stop sign',
                    'Defective vehicle equipment',
                    'Improper passing',
                    'Failure to yield right of way',
                    'Following too close/tailgating',
                    'Driving on the wrong side of the road',
                    'Careless driving'
                ]
            },
            {
                formControl: 'noOfAtFaultAccidents',
                subtitle: 'How many AT FAULT accidents have you been involved in?'
            },
            {
                formControl: 'noOfNotAtFaultAccidents',
                subtitle: 'How many NOT AT FAULT accidents have you been involved in?'
            },
            {
                formControl: 'noOfComprehensiveClaims',
                subtitle: 'How many comprehensive claims have you made?',
                listTitle: 'Common examples are:',
                list: [
                    'Glass repair or replacement',
                    'Collision with a bird or animal',
                    'Vandalism',
                    'Theft',
                    'Falling Objects (trees/hail)'
                ]
            }
        ];
        this.isQuoteFinalized = false;
    }

    ngOnInit() {
        this.minorViolation = this.fb.group({
            noOfMovingViolations: ['none', Validators.required],
            noOfAtFaultAccidents: ['none', Validators.required],
            noOfNotAtFaultAccidents: ['none', Validators.required],
            noOfComprehensiveClaims: ['none', Validators.required]
        });

        this.minorViolation$ = this.store
            .select(fromStore.leadSelector)
            .pipe(distinctUntilChanged())
            .subscribe(leadData => {
                if (leadData) {
                    this.minorViolation.patchValue(leadData);
                    if (leadData.quote) {
                        this.isQuoteFinalized = leadData.quote.isQuoteFinalized || false;
                    }
                    this.isDriverHistoryLandingScreen = leadData.leadLandingScreen === 'drivinghistory';
                }
            });
        this.navService.upDateMarketingData();
    }

    nextQuestion() {
        this.store.dispatch(new LeadActions.SavePNIData(this.minorViolation.value));
        this.loaderStopped = false;
        this.navService.saveLeadAndNavigate(this.ngDestroy$);

    }

    ngOnDestroy() {
        if (this.minorViolation$) {
            this.minorViolation$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
