import { RecoverQuoteActionTypes, RecoverQuoteActionsUnion } from '../actions/recover-quote.actions';
import { createSelector } from '@ngrx/store';
export const initialRouteState = {};
export function recoverQuoteReducer(state = initialRouteState, action: RecoverQuoteActionsUnion) {
    if (action.type === RecoverQuoteActionTypes.SET_SEARCH_QUOTE_CRITERIA) {
        return {
            ...state,
            searchCriteria: {
                ...action.payload
            }
        };
    } else if (action.type === RecoverQuoteActionTypes.SEARCH_QUOTE) {
        return {
            ...state,
            ...action.payload
        };
    } else {
        return state;
    }
}
export const recoverQuoteSelector = appState => appState.recoverQuote;
export const quoteSummary = createSelector(
    recoverQuoteSelector,
    recoverQuote => recoverQuote.quoteSummary
);
export const quoteSearchCriteria = createSelector(
    recoverQuoteSelector,
    recoverQuote => recoverQuote.searchCriteria
);
