import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NavigationService } from './core/services/navigation.service';
import * as LeadActions from './store/actions/lead.actions';
import { DataLayerService } from './core/services/data-layer.service';
import { RouteService } from './core/services/route.service';
import * as ErrorActions from './store/actions/error.actions';
import * as fromStore from './store/reducers/lead.reducers';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'verti-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';
    routeStoreSubscription: Subscription;
    routeChangeSubscription: Subscription;
    navigationStartSubscription: Subscription;
    loaderSubscription: Subscription;
    flow: string;
    routeNameForShowHideName: string;
    constructor(
        private router: Router,
        private store: Store<any>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private dataLayerService: DataLayerService,
        private routeService: RouteService,
        private titleService: Title,
        private translate: TranslateService
    ) {
        translate.setDefaultLang('en');
        const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
        this.routeStoreSubscription = this.store
            .select(state => state.routes)
            .subscribe(routesState => {
                if (routesState && routesState.routes.length) {
                    const leadId =
                        queryParamMap.get('leadID') ||
                        queryParamMap.get('LeadID') ||
                        queryParamMap.get('LeadId') ||
                        queryParamMap.get('leadId') ||
                        queryParamMap.get('leadid');
                    const quoteId =
                        this.getParameterByName('quoteID') ||
                        this.getParameterByName('quoteId') ||
                        this.getParameterByName('quoteid') ||
                        this.getParameterByName('QuoteId') ||
                        this.getParameterByName('QuoteID');
                    this.navService.visibleRoutes = routesState.routes.filter(item => item.visible === true);
                    if (leadId) {
                        const routePath = this.router.url.split('?')[0].substr(1);
                        const currentRouteObj = this.navService.getRouteObjByName(routePath);
                        this.navService.currentRoute = currentRouteObj.routeName;
                        this.navService.currentRouteObj = currentRouteObj;
                        this.flow = 'leadGen';
                        this.routeService.landingRoute = routePath;
                    } else if (quoteId) {
                        const routePath = this.router.url.split('?')[0].substr(1);
                        const currentRouteObj = this.navService.getRouteObjByName(routePath);
                        this.navService.currentRoute = currentRouteObj.routeName;
                        this.navService.currentRouteObj = currentRouteObj;
                        this.flow = 'recover';
                        this.routeService.landingRoute = routePath;
                    } else if (window.location.href.indexOf('recoverquote') > -1) {
                        this.navService.currentRoute = 'recoverquote';
                        this.navService.currentRouteObj = this.navService.visibleRoutes[0];
                        this.flow = 'recover';
                        this.routeService.landingRoute = 'recoverquote';
                    } else {
                        this.navService.currentRoute = this.navService.visibleRoutes[0].routeName;
                        this.navService.currentRouteObj = this.navService.visibleRoutes[0];
                        this.flow = 'organic';
                        this.routeService.landingRoute = this.navService.visibleRoutes[0].routeName;
                    }
                    this.store.dispatch(
                        new LeadActions.UpdateGenerateQuickQuotePriceFlag({
                            generateQuickQuotePrice: this.navService.currentRouteObj.generateQuickQuotePrice,
                            rateQuote: this.navService.currentRouteObj.rateQuote,
                            finalizeQuote: this.navService.currentRouteObj.finalizeQuote,
                            updatePaymentPlan: this.navService.currentRouteObj.updatePaymentPlan,
                            evo: this.navService.currentRouteObj.evo,
                            validateDriver: this.navService.currentRouteObj.validateDriver,
                            validateRules: this.navService.currentRouteObj.validateRules
                        })
                    );
                }
            });
        // const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
        // to handle case insensitive match for words
        let campaignID =
            queryParamMap.get('campaignID') ||
            queryParamMap.get('campaignId') ||
            queryParamMap.get('CampaignId') ||
            queryParamMap.get('CampaignID');
        // if campaign Id is not exusted in query params, get it from dataLayer and set to marketing data
        if (!campaignID) {
            campaignID = window['dataLayer']['campaign_ID'];
            const marketingData = {
                campaignID: campaignID
            };
            this.store.dispatch(new LeadActions.SaveMarketingData(marketingData));
        }
        this.onRouteChange();
        this.loaderSubscription = this.store
            .select(state => state.loader.isLoading)
            .subscribe(loading => {
                if (loading) {
                    document.getElementById('animation_container').style.display = 'block';
                } else {
                    document.getElementById('animation_container').style.display = 'none';
                }
            });
    }
    ngOnInit() {
        // this.updatePage();
        this.dataLayerService.pushStepTotal(this.navService.currentRoute.split('/')[0]);
        document.getElementById('body').style.background = 'transparent';
        this.store
            .select(fromStore.quoteSelector)
            .pipe(take(1))
            .subscribe(quote => {
                this.navService.isADPFQuote = quote.isADPFQuote;
                this.navService.quoteNumber = quote.quoteNumber;
                this.navService.premiumChangeIndicator = quote['premiumChangeIndicator'];
            });
    }
    ngDestroy() {
        if (this.routeStoreSubscription) {
            this.routeStoreSubscription.unsubscribe();
        }
        if (this.routeChangeSubscription) {
            this.routeChangeSubscription.unsubscribe();
        }
        if (this.navigationStartSubscription) {
            this.navigationStartSubscription.unsubscribe();
        }
    }
    onRouteChange() {
        this.routeChangeSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                if (event['url']) {
                    // this.updatePage();
                    this.navService.previousRoute = this.navService.currentRoute;
                    const currentRoute = event['url'].split('?')[0];
                    this.routeNameForShowHideName = currentRoute.split('/')[1];
                    this.navService.currentRoute = currentRoute.substr(1) || this.routeService.landingRoute;
                    this.navService.makeChangesOnRouteNav();
                    if (this.navService.currentRouteObj) {
                        this.store.dispatch(
                            new LeadActions.UpdateGenerateQuickQuotePriceFlag({
                                generateQuickQuotePrice: this.navService.currentRouteObj.generateQuickQuotePrice,
                                rateQuote: this.navService.currentRouteObj.rateQuote,
                                finalizeQuote: this.navService.currentRouteObj.finalizeQuote,
                                updatePaymentPlan: this.navService.currentRouteObj.updatePaymentPlan,
                                evo: this.navService.currentRouteObj.evo,
                                validateDriver: this.navService.currentRouteObj.validateDriver,
                                validateRules: this.navService.currentRouteObj.validateRules
                            })
                        );
                    }
                    // Reset Number of times Error Occurred On Same Screen to 0
                    this.navService.numOfTimesErrorOccurredOnScreen = 0;
                    const noError = {
                        code: '',
                        message: ''
                    };
                    this.store.dispatch(new ErrorActions.SetErrorAction(noError));
                    this.dataLayerService.pushStepTotal(this.navService.currentRoute.split('/')[0]);
                }
            });
    }
    // updatePage() {
    //     const pageUrl = window.location.href;
    //     const pageTitle = this.titleService.getTitle();
    //     window['conciergeReady'].then(() => {
    //         return window['GoMoxie'].conciergeV2.updatePage(pageUrl, pageTitle);
    //     });
    // }
    getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name.toUpperCase() + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url.toUpperCase());
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
