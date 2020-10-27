import { Action } from '@ngrx/store';
import { Route } from '../models/route.model';
export enum RouteActionTypes {
    GET_ROUTE = '[GET ROUTE] GET',
    ROUTE_FAIL = '[ROUTE_FAIL] FAIL',
    ROUTE_SUCCESS = '[ROUTE_SUCCESS] SUCCESS',
    ROUTE_LOAD = '[ROUTE_LOAD] LOAD'
}

export class GetRouteAction implements Action {
    readonly type = RouteActionTypes.GET_ROUTE;
    constructor(public payload: ProjectFlow) { }
}
export class RouteSuccessAction implements Action {
    readonly type = RouteActionTypes.ROUTE_SUCCESS;
    constructor(public payload: Route[]) { }
}
export class RouteFailureAction implements Action {
    readonly type = RouteActionTypes.ROUTE_FAIL;
    constructor(public payload: any) { }
}
export type RouteActions = GetRouteAction | RouteSuccessAction | RouteFailureAction;

export interface ProjectFlow {
    routeType?: string;
    stateCode: string;
    companyName: string;
}
