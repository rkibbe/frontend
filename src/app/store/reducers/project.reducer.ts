import { ProjectActions, ProjectActionTypes } from '../actions/project.actions';

export const initialRouteState = {
    projectName: '',
    stateCode: 'PA'
};

export function projectReducer(state = initialRouteState, action: ProjectActions) {
    if (action.type === ProjectActionTypes.PROJECT_SET) {
        return {
            ...state,
            ...action.payload
        };
    } else {
        return state;
    }
}
