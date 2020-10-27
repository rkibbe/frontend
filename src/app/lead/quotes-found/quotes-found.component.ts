import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Lead } from '@app/store/models/lead.model';
import { Route } from '@app/store/models/route.model';
import { Store } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { NavigationService } from '@services/navigation.service';
import { QuoteService } from '@services/quote.service';
import { AppSettings } from '@shared/settings/app-settings';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-quotes-found',
    templateUrl: './quotes-found.component.html',
    styleUrls: ['./quotes-found.component.scss']
})
export class QuotesFoundComponent implements OnInit, OnDestroy {
    recoverQuoteSub: Subscription;
    visibleRouteList: Route[];
    quotes: any[];
    leadData: Lead;
    appSettings: AppSettings;
    numOfTimesErrorOccurredOnScreen: number;
    constructor(
        private store: Store<any>,
        public dialog: MatDialog,
        private quoteService: QuoteService,
        private navService: NavigationService,
        private appSettingService: AppSettingsService
    ) {
        this.appSettingService
            .getSettings()
            .pipe(take(1))
            .subscribe(settings => {
                this.appSettings = settings;
            });
        this.store
            .select(state => state.routes)
            .subscribe(routesState => {
                if (routesState && routesState.routes.length) {
                    this.visibleRouteList = routesState.routes.filter(item => item.visible === true);
                }
            });
        this.quotes = [];
        this.numOfTimesErrorOccurredOnScreen = 0;
    }

    ngOnInit() {
        this.recoverQuoteSub = this.store
            .select(state => state.recoverQuote)
            .pipe(take(1))
            .subscribe((recoverQuote) => {
                if (recoverQuote) {
                    this.leadData = recoverQuote.leadSummary.lead;
                    const searchResults = recoverQuote.quoteSummary.quotes;
                    searchResults.map((quote) => {
                        this.quotes.push({
                            quoteNumber: quote.quoteNumber,
                            timestamp: this.formatedDate(quote.createdDate),
                            price: quote.monthlyPremium,
                            names: quote.drivers,
                            cars: quote.vehicles,
                            isQuickQuote: quote.isQuickQuote,
                            quickQuoteNumber: quote.isQuickQuote ? quote.quickQuoteNumber : '',
                            redirectRouteName: quote.redirectRouteName
                        });
                    });
                }
            });
    }

    formatedDate(date) {
        const newDate = new Date(date);
        const months = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
        let hours = newDate.getHours();
        const minutes = newDate.getMinutes();

        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;

        const minutesFormated = minutes.toString().length <= 1 ? '0' + minutes : minutes;

        return months[newDate.getMonth()] + ' ' + newDate.getDate() + ', '
            + newDate.getFullYear() + ', ' + hours + ':' + minutesFormated + ' ' + ampm;
    }

    getFirstQuote() {
        return this.quotes.length && this.quotes[0];
    }

    getPreviousQuotes() {
        return this.quotes.slice(1);
    }

    onStartNewQuoteClick() {
        if (this.visibleRouteList.length) {
            this.navService.gotoRouteByName(this.visibleRouteList[0].routeName);
        }
    }

    continueQuoteHandler(quote): void {
        if (!quote.isQuickQuote && quote.quoteNumber) {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            const request = {
                quoteNumber: quote.quoteNumber,
                isQuickQuote: quote.isQuickQuote,
                leadData: { lead: this.leadData }
            };
            this.quoteService.getQuote(request)
                .subscribe((res: Lead) => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    const error = res.error;
                    if (!error) {
                        this.store.dispatch(new LeadActions.PostLeadSuccessAction(res));
                        this.navService.gotoRouteByName(res['lead'].quickQuote.redirectRouteName);
                    } else {
                        const errorCode = +error.code;
                        if (this.appSettings.PERSONAL_DATA_ALERT_CODES.includes(errorCode)) {
                            this.navService.gotoRouteByName('personaldataalert');
                        } else if (this.appSettings.DECLINE_CODES.includes(errorCode)) {
                            this.navService.gotoRouteByName('kodecline');
                        } else if (this.appSettings.CALL_US_CODES.includes(errorCode)) {
                            this.navService.gotoRouteByName('contactus');
                        } else {
                            this.errorHandler();
                        }
                    }
                }, (error) => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.errorHandler();
                });
        } else {
            this.store.dispatch(new LeadActions.PostLeadSuccessAction({ lead: this.leadData }));
            this.navService.gotoRouteByName(this.leadData.quickQuote.redirectRouteName);
        }
    }
    showErrorModalPopUp() {
        this.dialog.open(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    }
    errorHandler() {
        this.numOfTimesErrorOccurredOnScreen++;
        if (this.numOfTimesErrorOccurredOnScreen < 4) {
            this.showErrorModalPopUp();
        } else {
            this.navService.gotoRouteByName('systemfailure');
        }
    }
    ngOnDestroy() {
        if (this.recoverQuoteSub) {
            this.recoverQuoteSub.unsubscribe();
        }
    }
}
