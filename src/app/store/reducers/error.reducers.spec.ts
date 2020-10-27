import { errorReducer, initialRouteState } from './error.reducers';
import { SetErrorAction } from '../actions/error.actions';

const mockError = {
    code: 'string',
    message: 'string'
};
const mockErrorEmpty = {
    code: '',
    message: ''
};

describe('error reducer', () => {
    it('returns inital router state for default action', () => {
        const action: any = {};
        expect(errorReducer(initialRouteState, action)).toEqual(initialRouteState);
    });
    it('error message empty action', () => {
        const action = new SetErrorAction(mockErrorEmpty);
        const state = errorReducer(initialRouteState, action);
        expect(state).toEqual(mockErrorEmpty);
    });

    it('error message action', () => {
        const action = new SetErrorAction(mockError);
        const state = errorReducer(initialRouteState, action);
        expect(state).toEqual(mockError);
    });
});
