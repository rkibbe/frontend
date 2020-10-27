import { Action } from '@ngrx/store';

export enum RecoverQuoteActionTypes {
    SEARCH_QUOTE = '[quote search]',
    SET_SEARCH_QUOTE_CRITERIA = '[quote search criteria set]'
}

export class SetRecoverQuotesEARCHCriteriaAction implements Action {
    readonly type = RecoverQuoteActionTypes.SET_SEARCH_QUOTE_CRITERIA;
    constructor(public payload: any) { }
}
export class SearchQuoteAction implements Action {
    readonly type = RecoverQuoteActionTypes.SEARCH_QUOTE;
    constructor(public payload: any) { }
}

export type RecoverQuoteActionsUnion = SetRecoverQuotesEARCHCriteriaAction | SearchQuoteAction;
