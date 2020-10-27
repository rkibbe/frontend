import { Action } from '@ngrx/store';
export enum LoaderActionTypes {
    START_LOADER = '[loader] start',
    STOP_LOADER = '[loader] stop'
}

export class StartLoaderAction implements Action {
    readonly type = LoaderActionTypes.START_LOADER;
    constructor() {}
}
export class StopLoaderAction implements Action {
    readonly type = LoaderActionTypes.STOP_LOADER;
    constructor() {}
}

export type LoaderActions = StartLoaderAction | StopLoaderAction;
