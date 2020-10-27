import { ConfigurationActionTypes, ConfigurationActions } from '../actions/configuration.action';

export const initialConfigurationState = {
    location: {
        lattitude: 0,
        longitude: 0
    }
};

export function configurationReducer(state = initialConfigurationState, action: ConfigurationActions) {
    if (action.type === ConfigurationActionTypes.SET_CONFIGURATION) {
        return {
            ...state,
            ...action.payload
        };
    } else {
        return state;
    }
}
