import { routeReducer, initialRouteState } from './route.reducers';
import { RouteSuccessAction } from '../actions/route.actions';

const mockRouter = {
    routes: [
        {
            referringURL: '',
            routeName: 'basicinfo',
            visible: true,
            preFill: true,
            generateQuickQuotePrice: false,
            rateQuote: false,
            finalizeQuote: false,
            updatePaymentPlan: false,
            evo: false,
            replaceUrl: false,
            validateDriver: false,
            validateRules: false
        }
    ]
};

describe('route reducer', () => {
    it('returns inital route state for default action', () => {
        const action: any = {};
        expect(routeReducer(initialRouteState, action)).toEqual(initialRouteState);
    });
    it('Route Success Action', () => {
        const action = new RouteSuccessAction(mockRouter.routes);
        const state = routeReducer(initialRouteState, action);
        expect(state.routes).toEqual(mockRouter.routes);
    });
});
