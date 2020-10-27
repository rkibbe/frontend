import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppSettingsService } from '@services/app-settings.service';
import { NavigationService } from '@services/navigation.service';
import { ProgressbarService } from '@services/progressbar.service';
import { AppSettings } from '@shared/settings/app-settings';
import { filter, take } from 'rxjs/operators';
import { hideMileStoneinPages, progressBarArray } from '../constants';
@Component({
    selector: 'verti-milestones-and-backbtn',
    templateUrl: './milestones-and-backbtn.component.html'
})
export class MilestonesAndBackbtnComponent implements OnInit {
    totalProgressValue = 0;
    routeChangeSubscription;
    currentRouteIndex: number;
    hideMileStoneContainer = false;
    completedProgressValue = -1;
    mileStonesArr: Array<string>;
    hideMileStoneinPages = hideMileStoneinPages;

    showFullQuoteProgress = false;
    nonFullQuoteEndPageIndex: number;
    appSettings: AppSettings;
    @Input('flow') flow;
    constructor(
        private navService: NavigationService,
        private router: Router,
        private progressbarService: ProgressbarService,
        private appSettingService: AppSettingsService
    ) {
        this.appSettingService
            .getSettings()
            .pipe(take(1))
            .subscribe(settings => {
                this.appSettings = settings;
            });
        let url = window.location.hash;
        url = url && url.split('#')[1];
        if (url && this.hideMileStoneinPages.indexOf(url) !== -1 || this.navService.currentRoute === 'leadlanding') {
            this.hideMileStoneContainer = true;
        }
        this.nonFullQuoteEndPageIndex = 0;
        this.nonFullQuoteEndPageIndex = this.navService.getRouteIndexByName('driversummary');
        this.routeChangeSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                url = event['url'].split('/')[1];
                url = url.split('?')[0];
                if (this.hideMileStoneinPages.indexOf(url) !== -1 || this.navService.currentRoute === 'leadlanding') {
                    this.hideMileStoneContainer = true; // pages progress bar shouldn't show
                } else {
                    this.hideMileStoneContainer = false;
                    this.getTotalProgressValue();
                    if (this.completedProgressValue > this.totalProgressValue) {
                        this.totalProgressValue = this.completedProgressValue;
                    }
                }
            });
    }

    ngOnInit() {
        this.getTotalProgressValue();
    }

    findProgressPercentage(currentIndex, progressIndex) {
        return 50; // hardcoded 50%
    }
    fullQuoteProgressBar() {
        this.mileStonesArr = progressBarArray.fullQuotemileStoneObj.map(obj => obj.routeName);
        this.showFullQuoteProgress = true;
        this.completedProgressValue = this.progressbarService.fullQuoteProgressValue;
    }
    getTotalProgressValue() {
        const currentRouteIndex = this.navService.getCurrentRouteIndex();
        if (this.nonFullQuoteEndPageIndex >= currentRouteIndex && this.navService.currentRouteObj) {
            this.mileStonesArr = progressBarArray.mileStoneObj.map(obj => obj.routeName);
            this.showFullQuoteProgress = false;
        } else if (this.appSettings.FULL_PROGRESS_PAGES.includes(this.navService.currentRoute)) {
            this.fullQuoteProgressBar();
        } else {
            this.fullQuoteProgressBar();
        }

        this.currentRouteIndex = currentRouteIndex;
        this.totalProgressValue = 0;

        for (const element of this.mileStonesArr) {
            const progressBarIndex = this.navService.getRouteIndexByName(element);
            if (currentRouteIndex !== -1 && currentRouteIndex < progressBarIndex) {
                this.totalProgressValue = this.findProgressPercentage(currentRouteIndex, progressBarIndex);
                this.totalProgressValue = (this.mileStonesArr.indexOf(element)) * 100 + 50;
                if (this.totalProgressValue > this.completedProgressValue) {
                    this.completedProgressValue = this.totalProgressValue;
                }
                break;
            } else if (currentRouteIndex !== -1 && currentRouteIndex === progressBarIndex) {
                this.totalProgressValue = (this.mileStonesArr.indexOf(element) + 1) * 100;
                if (this.totalProgressValue > this.completedProgressValue) {
                    this.completedProgressValue = this.totalProgressValue;
                }
                break;
            } else if (currentRouteIndex >= this.navService.getPrevoiusRoute() && currentRouteIndex === -1) {
                const visibleCurrentSubRoutes = this.navService.visibleCurrentSubRoutes;
                const currentParentRouteIndex = this.navService.currentParentRouteIndex;
                const currentParentRouteName = this.navService.getRouteByIndex(currentParentRouteIndex);
                const subRouteIndex = this.navService.getCurrentSubRouteIndex();
                this.totalProgressValue =
                    (this.mileStonesArr.indexOf(currentParentRouteName.routeName) + 1) * 100 +
                    this.findProgressPercentage(subRouteIndex, visibleCurrentSubRoutes.length);
                if (this.totalProgressValue > this.completedProgressValue) {
                    this.completedProgressValue = this.totalProgressValue;
                }
                break;
            }
        }
        if (this.nonFullQuoteEndPageIndex < this.currentRouteIndex) {
            this.progressbarService.fullQuoteProgressValue = this.completedProgressValue;
        }
    }
}
