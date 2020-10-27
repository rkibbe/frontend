import { Component, OnInit } from '@angular/core';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Store } from '@ngrx/store';
@Component({
    selector: 'verti-token-confirm',
    templateUrl: './token-confirm.component.html'
})
export class TokenConfirmComponent implements OnInit {
    constructor(private store: Store<any>) { }

    ngOnInit() {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
    }
}
