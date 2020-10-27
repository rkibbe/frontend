import { Action } from '@ngrx/store';
import { Project } from '../models/project.model';
export enum ProjectActionTypes {
    PROJECT_SET = '[SET PROJECT] SET',
}

export class SetProjectAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_SET;
    constructor(public payload: Project) { }
}

export type ProjectActions = SetProjectAction;
