import {
    recoverQuoteReducer,
    initialRouteState,
    recoverQuoteSelector,
    quoteSummary,
    quoteSearchCriteria
} from './recover-quote.reducers';
import { SetRecoverQuotesEARCHCriteriaAction, SearchQuoteAction } from '../actions/recover-quote.actions';

const searchCriteria = {
    lastName: 'last name',
    firstName: 'first name',
    email: 'verti@verti.com',
    dob: '10/22/2002',
    zipCode: '123456'
};
const mockQuoteSummary = {
    quoteNumber: 'string',
    isQuickQuote: true,
    fullPremium: 123,
    monthlyPremium: 12,
    drivers: 'string',
    vehicles: 'string',
    createdDate: 'string',
    redirectRouteName: 'string'
};

describe('recover quote reducer', () => {
    it('returns inital loader state for default action', () => {
        const action: any = {};
        expect(recoverQuoteReducer(initialRouteState, action)).toEqual(initialRouteState);
    });
    it('Set Recover Quote sEARCH Criteria Action', () => {
        const action = new SetRecoverQuotesEARCHCriteriaAction(searchCriteria);
        const state = recoverQuoteReducer(initialRouteState, action);
        expect(state).toEqual({ searchCriteria });
    });
    it('Search Quote Action', () => {
        const action = new SearchQuoteAction({ success: 'success' });
        const state = recoverQuoteReducer(initialRouteState, action);
        expect(state).toEqual({ success: 'success' });
    });

    describe('recover quote selectors', () => {
        it('should return quote Summary', () => {
            expect(quoteSummary.projector({ quoteSummary: mockQuoteSummary })).toEqual(mockQuoteSummary);
        });
        it('should return quote Search Criteria', () => {
            expect(quoteSearchCriteria.projector({ searchCriteria: searchCriteria })).toEqual(searchCriteria);
        });
    });
});
