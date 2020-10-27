import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { progressBarArray } from '../../core/constants';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take } from 'rxjs/operators';
import { Lead } from '@app/store/models/lead.model';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription } from 'rxjs';
@Component({
    selector: 'verti-progress-bar',
    templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent implements OnInit, OnDestroy, OnChanges {
    @Input('totalProgressValue') totalProgressValue: string;
    @Input('showFullQuoteProgress') showFullQuoteProgress: boolean;
    // @Input()
    // public set totalProgressValue(val: string) {
    //     if(val !== undefined){
    //         const currentValue = val;
    //         this.getCompletedMileStoneImg(currentValue);
    //     }
    // }
    mileStoneObj;
    fullQuotemileStoneObj;
    numberOfSteps: number;
    firstMileStone;
    progressBarValue;

    driverImg;
    vehicleImg;
    quickQuoteImg;
    searchImg;
    coverageImg;
    signImg;
    cartImg;
    finishImg;

    driverMileNotCompleted = true;
    vehicleMileNotCompleted = true;
    quoteMileNotCompleted = true;

    coverageMileNotCompleted = true;
    signMileNotCompleted = true;
    cartMileNotCompleted = true;
    finishMileNotCompleted = true;

    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    routeName: string;
    imgSource: string;
    constructor(private navService: NavigationService, private router: Router, private store: Store<any>) {
        if (this.navService.visibleRoutes && this.navService.visibleRoutes.length) {
            this.firstMileStone = {
                routeName: this.navService.visibleRoutes[0].routeName,
                imgSource: this.showFullQuoteProgress
                    ? './assets/img/search_complete.svg'
                    : './assets/img/progress_Img_Info.svg'
            };
        }
        this.mileStoneObj = progressBarArray.mileStoneObj;
        this.fullQuotemileStoneObj = progressBarArray.fullQuotemileStoneObj;

        this.quickQuoteImg = this.mileStoneObj[2].inCompleteImg;
        this.vehicleImg = this.mileStoneObj[1].inCompleteImg;
        this.driverImg = this.mileStoneObj[0].inCompleteImg;

        this.coverageImg = this.fullQuotemileStoneObj[0].inCompleteImg;
        this.signImg = this.fullQuotemileStoneObj[1].inCompleteImg;
        this.cartImg = this.fullQuotemileStoneObj[2].inCompleteImg;
        this.finishImg = this.fullQuotemileStoneObj[3].inCompleteImg;
    }

    ngOnInit() { }

    ngOnChanges(changes) {
        if (this.showFullQuoteProgress) {
            this.numberOfSteps = this.fullQuotemileStoneObj.length;
        } else {
            this.numberOfSteps = this.mileStoneObj.length;
        }
        if (this.firstMileStone) {
            this.firstMileStone.imgSource = this.showFullQuoteProgress
                ? './assets/img/search_complete.svg'
                : './assets/img/progress_Img_Info.svg';
        }
        if (changes.totalProgressValue !== undefined) {
            const currentValue = changes.totalProgressValue.currentValue;
            this.getCompletedMileStoneImg(currentValue);
        }
    }

    getCompletedMileStoneImg(currentValue) {
        const completedMile = (currentValue / 50) * (100 / (this.numberOfSteps * 2));
        this.progressBarValue = completedMile;

        this.quickQuoteImg = this.mileStoneObj[2].inCompleteImg;
        this.vehicleImg = this.mileStoneObj[1].inCompleteImg;
        this.driverImg = this.mileStoneObj[0].inCompleteImg;
        this.driverMileNotCompleted = true;
        this.vehicleMileNotCompleted = true;
        this.quoteMileNotCompleted = true;

        this.coverageImg = this.fullQuotemileStoneObj[0].inCompleteImg;
        this.signImg = this.fullQuotemileStoneObj[1].inCompleteImg;
        this.cartImg = this.fullQuotemileStoneObj[2].inCompleteImg;
        this.finishImg = this.fullQuotemileStoneObj[3].inCompleteImg;
        this.coverageMileNotCompleted = true;
        this.signMileNotCompleted = true;
        this.cartMileNotCompleted = true;
        this.finishMileNotCompleted = true;

        if (this.showFullQuoteProgress) {
            switch (true) {
                case completedMile >= 100:
                    this.coverageImg = this.fullQuotemileStoneObj[0].completedImg; // all milestones completed
                    this.signImg = this.fullQuotemileStoneObj[1].completedImg;
                    this.cartImg = this.fullQuotemileStoneObj[2].completedImg;
                    this.finishImg = this.fullQuotemileStoneObj[3].completedImg;
                    this.coverageMileNotCompleted = false;
                    this.signMileNotCompleted = false;
                    this.cartMileNotCompleted = false;
                    this.finishMileNotCompleted = false;
                    break;
                case completedMile >= 75:
                    this.coverageImg = this.fullQuotemileStoneObj[0].completedImg; // Coverage, Sign and cart milestone completed
                    this.signImg = this.fullQuotemileStoneObj[1].completedImg;
                    this.cartImg = this.fullQuotemileStoneObj[2].completedImg;
                    this.coverageMileNotCompleted = false;
                    this.signMileNotCompleted = false;
                    this.cartMileNotCompleted = false;
                    break;
                case completedMile >= 50:
                    this.coverageImg = this.fullQuotemileStoneObj[0].completedImg; // Coverage & Sign milestone completed
                    this.signImg = this.fullQuotemileStoneObj[1].completedImg;
                    this.coverageMileNotCompleted = false;
                    this.signMileNotCompleted = false;
                    break;
                case completedMile >= 25:
                    this.coverageImg = this.fullQuotemileStoneObj[0].completedImg; // only Coverage milestone completed
                    this.coverageMileNotCompleted = false;
                    break;
            }
        } else {
            switch (true) {
                case completedMile >= 99:
                    this.quickQuoteImg = this.mileStoneObj[2].completedImg; // all milestones completed
                    this.vehicleImg = this.mileStoneObj[1].completedImg;
                    this.driverImg = this.mileStoneObj[0].completedImg;
                    this.driverMileNotCompleted = false;
                    this.vehicleMileNotCompleted = false;
                    this.quoteMileNotCompleted = false;
                    break;
                case completedMile >= 66:
                    this.vehicleImg = this.mileStoneObj[1].completedImg; // vehicle and driver summary milestone completed
                    this.driverImg = this.mileStoneObj[0].completedImg;
                    this.driverMileNotCompleted = false;
                    this.vehicleMileNotCompleted = false;
                    break;
                case completedMile >= 33:
                    this.driverImg = this.mileStoneObj[0].completedImg; // only driver summary milestone completed
                    this.driverMileNotCompleted = false;
                    break;
            }
        }
    }

    navigateToCompleted(route) {
        // route to be navigated to
        this.routeName = route;
        // this.navService.gotoRouteByName(route);
        // if next route is first route, no need to trigger service
        if (this.navService.visibleRoutes[0].routeName === route) {
            this.navService.gotoRouteByName(route);
        } else {
            // make leadQuote service and navigate
            this.invokeLeadQuoteAndNavigate();
        }
    }
    invokeLeadQuoteAndNavigate() {
        this.loaderStopped = false;
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
                    // this.router.navigate(['driversummary']);
                    this.navService.gotoRouteByName(this.routeName);
                }
            });
    }
    ngOnDestroy() {
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
