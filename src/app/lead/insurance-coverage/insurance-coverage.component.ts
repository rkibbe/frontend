import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import { TypeListService, TypeListOption } from '@services/type-list.service';
import { takeUntil, finalize, take } from 'rxjs/operators';
import { StopLoaderAction, StartLoaderAction } from 'src/app/store/actions/loader.actions';
import { AddInsuranceCoverageInfo, PostLeadAction } from 'src/app/store/actions/lead.actions';
import { quoteSelector } from 'src/app/store/reducers/lead.reducers';

import { Lead } from '@app/store/models/lead.model';
import { leadSelector } from '@app/store/reducers/lead.reducers';
import * as LeadActions from '@app/store/actions/lead.actions';
@Component({
    selector: 'verti-insurance-coverage',
    templateUrl: './insurance-coverage.component.html'
})
export class InsuranceCoverageComponent implements OnInit, OnDestroy {
    insuranceCoverageForm: FormGroup;
    title: string;
    insuranceCoverageForm$: Subscription;
    imgSource: string;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    loaderStopped: boolean;
    yesValue: boolean;
    noValue: boolean;

    yearsInsuredExt: TypeListOption[] = [];
    priorPolicyLimitsExt: TypeListOption[] = [];
    lastActiveInsurance: TypeListOption[] = [];
    private ngDestroy$ = new Subject();
    selectedYearsInsuredValue: TypeListOption;
    selectedPriorPolicyLimitsValue: TypeListOption;
    selectedLapsePeriodExtValue: TypeListOption;
    quoteRated: boolean;
    currentInsurance: boolean;
    isCustomQuoteAvailable: boolean;
    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private navService: NavigationService,
        private typeListService: TypeListService
    ) {
        this.imgSource = './assets/img/manual_path_Icon.svg';
        this.title = `Do you have car insurance coverage currently?`;
        this.quoteRated = false;
        this.isCustomQuoteAvailable = false;
    }

    ngOnInit() {
        this.store.dispatch(new StartLoaderAction());
        this.insuranceCoverageForm = this.fb.group({
            coverage: ['', Validators.required]
        });
        this.navService.upDateMarketingData();
        this.requestInsuranceCoverageOptions();
    }

    requestInsuranceCoverageOptions() {
        forkJoin(
            this.typeListService.getYearsInsuredExtOptions(),
            this.typeListService.getPriorPolicyLimitsExtOptions(),
            this.typeListService.getLastActiveInsuranceExtOptions()
        )
            .pipe(
                takeUntil(this.ngDestroy$),
                // catchError(_ => {
                //     return EMPTY;
                // }),
                finalize(() => this.store.dispatch(new StopLoaderAction()))
            )
            .subscribe(([yearsInsured, priorPolicyLimit, lastActiveInsurance]) => {
                this.yearsInsuredExt = yearsInsured;
                this.priorPolicyLimitsExt = priorPolicyLimit;
                this.lastActiveInsurance = lastActiveInsurance;
                this.prefillInsuranceCoverage();
            });
    }

    prefillInsuranceCoverage() {
        this.insuranceCoverageForm$ = this.store
            .select(quoteSelector)
            .pipe(take(1))
            .subscribe(quote => {
                if (quote.currentInsuranceInfo) {
                    this.currentInsurance = quote.currentInsuranceInfo.currentInsurance;
                    if (this.currentInsurance !== undefined && this.currentInsurance !== null) {
                        this.insuranceCoverageForm.get('coverage').setValue(this.currentInsurance);
                        this.insuranceCoverageForm.get('coverage').patchValue(this.currentInsurance);
                        this.insuranceCoverageForm.updateValueAndValidity();
                        this.coverageToggle(true);
                        this.selectedYearsInsuredValue = this.yearsInsuredExt.find(
                            item => item.code === quote.currentInsuranceInfo.yearsInsured
                        );
                        this.selectedPriorPolicyLimitsValue = this.priorPolicyLimitsExt.find(
                            item => item.code === quote.currentInsuranceInfo.bILimits
                        );
                        this.selectedLapsePeriodExtValue = this.lastActiveInsurance.find(
                            item => item.code === quote.currentInsuranceInfo.lastActiveInsurance
                        );
                    }
                }
                if (quote.customQuote) {
                    this.isCustomQuoteAvailable = true;
                    this.quoteRated = quote.customQuote.quoteRated;
                }
            });
    }

    coverageToggle(preFillCheck?) {
        const isCurrentCoverage = this.insuranceCoverageForm.get('coverage').value;

        if (preFillCheck) {
            if (isCurrentCoverage === true) {
                this.yesValue = true;
                this.noValue = false;
            } else {
                this.yesValue = false;
                this.noValue = true;
            }
        } else {
            // if user changes options
            this.selectedYearsInsuredValue = undefined;
            this.selectedPriorPolicyLimitsValue = undefined;
            this.selectedLapsePeriodExtValue = undefined;
            if (isCurrentCoverage === true) {
                this.yesValue = true;
                this.noValue = false;
            } else {
                this.yesValue = false;
                this.noValue = true;
            }
        }
    }
    optionSelected(formData) {
        const currentInsuranceInfo = {
            currentInsurance: null,
            lastActiveInsurance: '',
            yearsInsured: '',
            bILimits: '',
            bILimitsValue: ''
        };
        if (formData.selected.lastActiveInsurance) {
            currentInsuranceInfo.lastActiveInsurance = formData.selected.lastActiveInsurance;
            currentInsuranceInfo.yearsInsured = formData.selected.yearsInsured || '';
            currentInsuranceInfo.bILimits = formData.selected.bILimits || '';
            currentInsuranceInfo.bILimitsValue = formData.selected.bILimitsValue || '';
        } else {
            currentInsuranceInfo.yearsInsured = formData.selected.yearsInsured.code;
            currentInsuranceInfo.bILimits = formData.selected.bILimits.code;
            currentInsuranceInfo.bILimitsValue = formData.selected.bILimits.description;
        }
        const coverageFormVal = this.insuranceCoverageForm.get('coverage').value;
        if (coverageFormVal === true) {
            currentInsuranceInfo.currentInsurance = true;
        } else {
            currentInsuranceInfo.currentInsurance = false;
        }

        this.store.dispatch(new AddInsuranceCoverageInfo({ currentInsuranceInfo }));
        if (this.isCustomQuoteAvailable && this.currentInsurance !== coverageFormVal) {
            this.store.dispatch(new LeadActions.UpdateCustomQuoteAction({ quoteRated: !this.quoteRated }));
        }
        this.loaderStopped = false;

        this.leadSub = this.store
            .select(leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.store.dispatch(new PostLeadAction(leadData));
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

    ngOnDestroy() {
        if (this.insuranceCoverageForm$) {
            this.insuranceCoverageForm$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }
}
