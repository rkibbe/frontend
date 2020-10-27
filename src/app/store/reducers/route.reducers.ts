import { RouteActions, RouteActionTypes } from '../actions/route.actions';

export const initialRouteState = {
    routes: []
};

export function routeReducer(state = initialRouteState, action: RouteActions) {
    if (action.type === RouteActionTypes.ROUTE_SUCCESS) {
        return {
            ...state,
            routes: action.payload.filter(item => item.visible === true)
        };
    } else {
        return state;
    }
}
