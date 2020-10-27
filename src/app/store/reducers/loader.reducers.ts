import { LoaderActionTypes, LoaderActions } from '../actions/loader.actions';
export const initialRouteState = {
    isLoading: false
};
export function loaderReducer(state = initialRouteState, action: LoaderActions) {
    switch (action.type) {
        case LoaderActionTypes.START_LOADER:
            return {
                ...state,
                isLoading: true
            };

        case LoaderActionTypes.STOP_LOADER:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
