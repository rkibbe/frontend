import { Injectable } from '@angular/core';
import { ActionsSubject, ReducerManager, StateObservable, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockStore<T> extends Store<T> {
    private stateSubject = new BehaviorSubject<T>({} as T);

    constructor(state$: StateObservable, actionsObserver: ActionsSubject, reducerManager: ReducerManager) {
        super(state$, actionsObserver, reducerManager);
        this.source = this.stateSubject.asObservable();
    }

    setState(nextState: T) {
        this.stateSubject.next(nextState);
    }
}

export function provideMockStore() {
    return {
        provide: Store,
        useClass: MockStore
    };
}
