import { Action } from '@ngrx/store';
import { Route } from '../models/route.model';
export enum ErrorActionTypes {
    SET_ERROR = '[error] set'
}

export class SetErrorAction implements Action {
    readonly type = ErrorActionTypes.SET_ERROR;
    constructor(public payload: any) {}
}

export type ErrorActions = SetErrorAction;
