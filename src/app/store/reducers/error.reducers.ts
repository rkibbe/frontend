import { ErrorActions, ErrorActionTypes } from '../actions/error.actions';

export const initialRouteState = {
    code: '',
    message: ''
};

export function errorReducer(state = initialRouteState, action: ErrorActions) {
    if (action.type === ErrorActionTypes.SET_ERROR) {
        return {
            ...state,
            ...action.payload
        };
    } else {
        return state;
    }
}
