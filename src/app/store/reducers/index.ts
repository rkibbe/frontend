import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { errorReducer } from './error.reducers';
import { leadReducer } from './lead.reducers';
import { loaderReducer } from './loader.reducers';
import { routeReducer } from './route.reducers';
import { recoverQuoteReducer } from './recover-quote.reducers';
import { projectReducer } from './project.reducer';
import { configurationReducer } from './configuration.reducers';

export interface AppState { }

export const reducers: ActionReducerMap<AppState> = {
    routes: routeReducer,
    lead: leadReducer,
    loader: loaderReducer,
    error: errorReducer,
    recoverQuote: recoverQuoteReducer,
    project: projectReducer,
    configuration: configurationReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];
