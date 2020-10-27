import { loaderReducer, initialRouteState } from './loader.reducers';
import { StartLoaderAction, StopLoaderAction } from '../actions/loader.actions';

const mockError = {
    isLoading: false
};
const mockErrorEmpty = {
    isLoading: undefined
};

describe('loader reducer', () => {
    it('returns inital loader state for default action', () => {
        const action: any = {};
        expect(loaderReducer(initialRouteState, action)).toEqual(initialRouteState);
    });
    // START_LOADER
    it('Start Loader Action action', () => {
        const action = new StartLoaderAction();
        const state = loaderReducer(mockErrorEmpty, action);
        expect(state.isLoading).toEqual(true);
    });
    it('Stop Loader Action action', () => {
        const action = new StopLoaderAction();
        const state = loaderReducer(mockErrorEmpty, action);
        expect(state.isLoading).toEqual(false);
    });
});
