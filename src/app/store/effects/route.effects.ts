import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { RouteService } from '../../core/services/route.service';
import { SplunkService } from '../../core/services/splunk.service';
import * as RouteActions from '../actions/route.actions';
import { Route } from '../models/route.model';
@Injectable()
export class RouteEffect {
    constructor(private actions: Actions, private routeService: RouteService, private splunkService: SplunkService) { }
    @Effect()
    getRoutes$: Observable<Action> = this.actions.pipe(
        ofType(RouteActions.RouteActionTypes.GET_ROUTE),
        mergeMap(action =>
            this.routeService.getRoutes(action).pipe(
                map(routes => new RouteActions.RouteSuccessAction(routes)),
                catchError(error => {
                    this.splunkService.log(error);
                    return this.routeService
                        .getRoutesFromFallback()
                        .pipe(map(routes => {
                            const routesFlow = action['payload'] as RouteActions.ProjectFlow;
                            const routesToLoad = routes[routesFlow.stateCode][routesFlow.routeType] as Route[];
                            return new RouteActions.RouteSuccessAction(routesToLoad);
                        }));
                })
            )
        )
    );
}
