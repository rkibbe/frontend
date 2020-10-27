import { Injectable } from '@angular/core';
import { HashLocationStrategy } from '@angular/common';
import { PlatformLocation } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouteService } from './core/services/route.service';
@Injectable()
export class CustomHashLocationStrategy extends HashLocationStrategy {
    visibleRouteList = [];
    baseHref: string;
    constructor(
        private platformLocation: PlatformLocation,
        private store: Store<any>,
        private routeService: RouteService
    ) {
        super(platformLocation);
        this.store
            .select(state => state.routes)
            .subscribe(routesState => {
                if (routesState && routesState.routes.length) {
                    this.visibleRouteList = routesState.routes.filter(item => item.visible === true);
                }
            });
        this.baseHref = '';
    }
    prepareExternalUrl(internal: string): string {
        const routeWithQueryParam = internal.substr(1);
        const routeWithQueryParamArr = routeWithQueryParam.split('?');
        const routeName = routeWithQueryParamArr[0];
        let urlPartAfterBaseUrl = window.location.search;
        const hashPart = window.location.hash;
        if (!urlPartAfterBaseUrl && hashPart) {
            // if Query Params exist
            const queryParam = hashPart.split('?')[1];
            if (queryParam) {
                urlPartAfterBaseUrl = '?' + queryParam;
            }
        }
        if (this.routeService.landingRoute === routeName) {
            return urlPartAfterBaseUrl ? this.baseHref + '' + urlPartAfterBaseUrl : this.baseHref;
        } else if (!routeName) {
            return urlPartAfterBaseUrl ? this.baseHref + '' + urlPartAfterBaseUrl : this.baseHref;
        }
        return this.baseHref + '/#' + routeWithQueryParam;
    }
}
