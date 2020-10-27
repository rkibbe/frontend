import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, forkJoin, zip, EMPTY, of } from 'rxjs';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import * as RouteActions from '@app/store/actions/route.actions';
import { Lead } from '@app/store/models/lead.model';
import { Route } from '@app/store/models/route.model';
import { RouteMap } from '../route.config';
import { LeadGenService } from '@services/lead-gen.service';
import { RouteService } from './route.service';
import { RecoverQuoteComponent } from '@app/lead/recover-quote/recover-quote.component';
import { QuoteService } from './quote.service';
import { AppSettings } from '@shared/settings/app-settings';
import { SetProjectAction } from '@app/store/actions/project.actions';
import { environment } from '@env/environment';
import { ConfigService, Configuration } from './conig.service';
import { SetConfigurationAction } from '@app/store/actions/configuration.action';
import { catchError, map } from 'rxjs/operators';
import { SplunkService } from './splunk.service';

@Injectable({
    providedIn: 'root'
})
export class AppInitService {
    routeStoreSubscription: Subscription;
    visibleRouteList: Route[];
    router: Router;
    leadId: string;
    qqId: string;
    flowType: string;
    quoteNumber: string;
    campaignID: string;
    companyName: string;
    stateCode: string;
    constructor(
        private injector: Injector,
        private store: Store<any>,
        private leadGenService: LeadGenService,
        private routeService: RouteService,
        private quoteService: QuoteService,
        private appSettings: AppSettings,
        private configService: ConfigService,
        private splunkService: SplunkService
    ) { }

    fetchRoutes() {
        return new Promise((resolve, reject) => {
            this.router = this.injector.get(Router);
            this.setProject();
            if (this.tokenConfirmed()) {
                resolve(true);
                return;
            }
            this.triggerRoutesService(resolve);
        });
    }
    getConfuguration() {
        this.configService
            .getConfiguration({ companyName: this.companyName, stateCode: this.stateCode })
            .subscribe(config => {
                this.store.dispatch(new SetConfigurationAction(config));
            });
    }
    setProject() {
        this.companyName = environment.companyName;
        this.stateCode =
            this.getParameterByName('stateCode') ||
            this.getParameterByName('statecode') ||
            environment.defaultStateCode;
        this.store.dispatch(new SetProjectAction({ companyName: this.companyName, stateCode: this.stateCode }));
    }
    makeLeadGenOrQuoteFetch(routesState, resolve) {
        if (routesState && routesState.length) {
            this.visibleRouteList = routesState.filter(item => item.visible === true);
            if (this.leadId) {
                this.triggerLeadGen(resolve);
            }
            if (this.quoteNumber) {
                this.triggerQuoteFetch(resolve);
            }
            this.configureRoutes();
            this.setMarketingData();
            if (!this.leadId && this.flowType !== 'recoverQuote' && !this.quoteNumber) {
                this.configureEmptyRoute(this.visibleRouteList[0].routeName);
                this.routeService.landingRoute = this.visibleRouteList[0].routeName;
                this.router.navigate([this.visibleRouteList[0].routeName], {
                    queryParams: this.formQueryParamsObj(),
                    queryParamsHandling: 'merge'
                });
                resolve(true);
            } else if (this.flowType === 'recoverQuote') {
                resolve(true);
                this.router.config.unshift({ path: '', component: RecoverQuoteComponent });
                this.router.navigate(['recoverquote']);
            }
        }
    }
    tokenConfirmed() {
        return window.location.href.indexOf('tokenconfirm') > -1;
    }
    triggerRoutesService(resolve) {
        this.leadId =
            this.getParameterByName('leadID') ||
            this.getParameterByName('LeadID') ||
            this.getParameterByName('leadId') ||
            this.getParameterByName('leadid') ||
            this.getParameterByName('Leadid');
        this.qqId =
            this.getParameterByName('qqID') ||
            this.getParameterByName('qqId') ||
            this.getParameterByName('QQID') ||
            this.getParameterByName('qqid') ||
            this.getParameterByName('QQId') ||
            this.getParameterByName('QqId');
        this.quoteNumber =
            this.getParameterByName('quoteID') ||
            this.getParameterByName('quoteId') ||
            this.getParameterByName('quoteid') ||
            this.getParameterByName('QuoteId') ||
            this.getParameterByName('QuoteID');
        if (window.location.href.indexOf('recoverquote') > -1) {
            this.flowType = 'recoverQuote';
        }
        if (this.leadId) {
            this.getRoutes(
                {
                    routeType: 'lead',
                    stateCode: this.stateCode,
                    companyName: this.companyName
                },
                resolve
            );
        } else if (this.flowType === 'recoverQuote' || this.quoteNumber) {
            this.getRoutes(
                {
                    routeType: 'recoverQuote',
                    stateCode: this.stateCode,
                    companyName: this.companyName
                },
                resolve
            );
        } else {
            this.getRoutes(
                {
                    routeType: 'organic',
                    stateCode: this.stateCode,
                    companyName: this.companyName
                },
                resolve
            );
        }
    }
    getRoutes(payload, resolve) {
        zip(
            this.routeService
                .getRoutes({ payload: payload })
                .pipe(catchError(error => this.getRoutesError(error, payload))),
            this.configService
                .getConfiguration({ companyName: this.companyName, stateCode: this.stateCode })
                .pipe(catchError(error => this.configError(error)))
        ).subscribe(([routData, configData]: [Route[], Configuration]) => {
            this.store.dispatch(new SetConfigurationAction(configData));
            this.store.dispatch(new RouteActions.RouteSuccessAction(routData));
            this.makeLeadGenOrQuoteFetch(routData, resolve);
        });
    }
    getRoutesError(error, payload) {
        this.splunkService.log(error);
        return this.routeService.getRoutesFromFallback().pipe(
            map(routes => {
                return routes[payload.stateCode][payload.routeType] as Route[];
            })
        );
    }
    configError(error) {
        this.store.dispatch(new LoaderActions.StopLoaderAction());
        return EMPTY;
    }

    configureRoutes() {
        this.visibleRouteList.forEach((route, index) => {
            // push all the visible routes to route configuration
            let visibleChildRouteList = [];
            const childRoutes = route['childRoutes'];
            if (childRoutes && childRoutes.length) {
                visibleChildRouteList = childRoutes.filter(item => item.visible === true);
            }
            this.router.config.unshift(RouteMap[route.routeName]);
            if (visibleChildRouteList && visibleChildRouteList.length) {
                visibleChildRouteList.forEach(childRoute => {
                    this.router.config.unshift(RouteMap[childRoute.routeName]);
                });
            }
        });
    }

    triggerLeadGen(resolve) {
        const queryParams = this.formQueryParamsObj();
        const firstDynamicRoute = this.visibleRouteList[0].routeName;
        this.leadGenService.getLeadGen(this.leadId, this.qqId).subscribe(
            (lead: Lead) => {
                if (!lead.error) {
                    this.store.dispatch(new LeadActions.PostLeadSuccessAction(lead));
                    const redirectRouteName = lead['lead'].quickQuote['redirectRouteName'] || firstDynamicRoute;
                    this.routeService.landingRoute = redirectRouteName;
                    this.configureEmptyRoute(redirectRouteName);
                    this.router.navigate([redirectRouteName], {
                        queryParams: queryParams,
                        queryParamsHandling: 'merge'
                    });
                    this.setMarketingData();
                } else {
                    this.routeService.landingRoute = firstDynamicRoute;
                    this.configureEmptyRoute(firstDynamicRoute);
                    this.router.navigate([firstDynamicRoute], {
                        queryParams: queryParams,
                        queryParamsHandling: 'merge'
                    });
                }
                resolve(true);
            },
            error => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                this.routeService.landingRoute = firstDynamicRoute;
                this.configureEmptyRoute(firstDynamicRoute);
                this.router.navigate([firstDynamicRoute], { queryParams: queryParams, queryParamsHandling: 'merge' });
                resolve(true);
            }
        );
    }
    triggerQuoteFetch(resolve) {
        const request = {
            quoteNumber: this.quoteNumber.trim(),
            isQuickQuote: false,
            leadData: {}
        };
        this.processQuoteService(request, resolve);
    }
    processQuoteService(request, resolve) {
        this.quoteService.getQuote(request).subscribe(
            (lead: Lead) => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                const error = lead.error;
                if (!error) {
                    const redirectRouteName = lead['lead'].quickQuote.redirectRouteName;
                    if (redirectRouteName) {
                        this.store.dispatch(new LeadActions.PostLeadSuccessAction(lead));
                        if (this.campaignID) {
                            this.store.dispatch(new LeadActions.SaveMarketingData({ campaignID: this.campaignID }));
                        }
                        this.configureEmptyRoute(redirectRouteName);
                    } else {
                        this.router.config.unshift({ path: '', component: RecoverQuoteComponent });
                    }
                    this.router.navigate([redirectRouteName || 'recoverquote'], {
                        queryParams: this.formQueryParamsObj(),
                        queryParamsHandling: 'merge'
                    });
                    resolve(true);
                } else {
                    resolve(true);
                    if (this.appSettings.PERSONAL_DATA_ALERT_CODES.includes(+error.code)) {
                        this.router.navigate(['personaldataalert']);
                    } else {
                        this.router.navigate(['recoverquote']);
                    }
                }
            },
            error => {
                resolve(true);
                this.router.navigate(['recoverquote']);
            }
        );
    }
    configureEmptyRoute(firstRoute) {
        this.router.config.unshift({ path: '', component: RouteMap[firstRoute].component });
    }

    setMarketingData() {
        const currentUrl = window.location.href;
        this.campaignID =
            this.getParameterByName('campaignID') ||
            this.getParameterByName('CampaignID') ||
            this.getParameterByName('CampaignId') ||
            this.getParameterByName('campaignId');
        const referringURL =
            this.getParameterByName('referringURL') ||
            this.getParameterByName('referringUrl') ||
            this.getParameterByName('ReferringURL') ||
            this.getParameterByName('ReferringUrl');
        const zipCode =
            this.getParameterByName('zipCode') ||
            this.getParameterByName('ZipCode') ||
            this.getParameterByName('Zipcode') ||
            this.getParameterByName('zipcode');
        const mbsy = this.getParameterByName('mbsy') || this.getParameterByName('Mbsy');
        const marketingData = {
            campaignID: this.campaignID,
            currentURL: currentUrl,
            referringURL: referringURL,
            zipCode: zipCode,
            mbsy: mbsy,
            currentRoute: this.routeService.landingRoute
        };
        this.store.dispatch(new LeadActions.SaveMarketingData(marketingData));
    }

    getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    formQueryParamsObj() {
        const queryParams: any = {};
        let urlParamsStr = '';
        if (window.location.search) {
            urlParamsStr = window.location.search.split('?')[1];
        } else {
            urlParamsStr = window.location.hash.split('?')[1];
        }

        if (urlParamsStr) {
            const urlParamsPairArr = urlParamsStr.split('&');
            if (urlParamsPairArr.length) {
                urlParamsPairArr.forEach(pair => {
                    const paramKeyValArr = pair.split('=');
                    queryParams[paramKeyValArr[0]] = paramKeyValArr[1];
                });
            }
        }
        return queryParams;
    }
}
