import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { leadSelector } from '@app/store/reducers/lead.reducers';
import { take } from 'rxjs/operators';
import { Quote, Lead } from '@app/store/models/lead.model';
import { Store } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { NavigationService } from '@services/navigation.service';
import { Route } from '@app/store/models/route.model';
@Component({
    selector: 'verti-evo-payment',
    templateUrl: './evo-payment.component.html',
    styleUrls: ['./evo-payment.component.scss']
})
export class EvoPaymentComponent implements OnInit {
    @ViewChild('evoIframe') evoIframe: ElementRef;
    title: string;
    urlReady: boolean;
    urlString: any;
    landingRoute: string;
    visibleRouteList: Route[];
    constructor(private store: Store<any>, private sanitizer: DomSanitizer, private navService: NavigationService) {
        this.urlReady = false;
        if (this.navService.policyNumber) {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            const location = window.location;
            window.location.href = location.origin + '' + location.pathname;
            this.store.dispatch(new LoaderActions.StopLoaderAction());
            return;
        } else if (this.navService.paymentCallBackCompleted) {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            this.store.dispatch(new LoaderActions.StopLoaderAction());
            if (window.navigator.userAgent.match('CriOS')) {
                window.history.go(-1);
            } else {
                window.history.go(-2);
            }
            return;
        }
        this.title = 'Add a payment method.';
        this.landingRoute = '';
        this.store
            .select(leadSelector)
            .pipe(take(1))
            .subscribe((lead: Lead) => {
                // leadGen flow
                this.landingRoute = lead.quickQuote.redirectRouteName;
                if (lead && lead.quote && lead.quote.evoToken) {
                    this.urlReady = true;
                    this.urlString = this.sanitizer.bypassSecurityTrustResourceUrl(
                        lead.quote.evoToken.paymentGatewayClientURL
                    );
                }
            });
        this.store
            .select(state => state.routes)
            .subscribe(routesState => {
                if (routesState && routesState.routes.length) {
                    this.visibleRouteList = routesState.routes.filter(item => item.visible === true);
                }
            });
    }
    ngOnInit() {
        this.navService.upDateMarketingData();
    }
    iframeContentLoaded() {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        try {
            const iframeUrl = this.evoIframe.nativeElement.contentWindow.location.href;
            if (iframeUrl && (iframeUrl.indexOf('#tokenconfirm') > -1 || this.isLandingUrl(iframeUrl))) {
                this.navService.navigate();
            } else if (iframeUrl.indexOf('https://cert-hp.evosnap.com') > -1) {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
            }
        } catch (e) {
            this.store.dispatch(new LoaderActions.StopLoaderAction());
        }
    }
    isLandingUrl(iframeUrl) {
        if (
            iframeUrl &&
            (iframeUrl.indexOf(this.landingRoute) > -1 ||
                iframeUrl.indexOf(this.visibleRouteList[0].routeName) > -1 ||
                iframeUrl === window.location.href.split('/#')[0])
        ) {
            return true;
        }
        return false;
    }
}
