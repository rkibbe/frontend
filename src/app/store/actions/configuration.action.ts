import { Action } from '@ngrx/store';
import { Configuration } from '@app/core/services/conig.service';
export enum ConfigurationActionTypes {
    SET_CONFIGURATION = '[configuration] set'
}

export class SetConfigurationAction implements Action {
    readonly type = ConfigurationActionTypes.SET_CONFIGURATION;
    constructor(public payload: Configuration) { }
}

export type ConfigurationActions = SetConfigurationAction;
