import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { NavigationService } from '@services/navigation.service';
import { TypeListOption, TypeListService } from '@services/type-list.service';

@Component({
    selector: 'verti-user-marital-status',
    templateUrl: './user-marital-status.component.html',
    styleUrls: ['./user-marital-status.component.scss']
})
export class UserMaritalStatusComponent implements OnInit {
    @Output() formGroupValue = new EventEmitter();
    @Output() formSubmit = new EventEmitter();
    @Input('formGroup') formGroup: FormGroup;
    @Input('options') options;
    maritalStatusOptions: TypeListOption[];

    constructor(
        private typeListService: TypeListService,
        private store: Store<any>,
        private navService: NavigationService
    ) {
        this.maritalStatusOptions = [];
    }

    ngOnInit() {
        // this.store.dispatch(new LoaderActions.StartLoaderAction());
        /*this.typeListService
            .getMaritalStatusOptions()
            .pipe(
                catchError(err => {
                    const customError = {
                        code: 600,
                        message: 'Service Failure/down'
                    };
                    this.store.dispatch(new ErrorActions.SetErrorAction(customError));
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    this.navService.gotoRouteByName('systemfailure');
                    return EMPTY;
                })
            )
            .subscribe(options => {
                const noError = {
                    code: '',
                    message: ''
                };
                this.store.dispatch(new ErrorActions.SetErrorAction(noError));
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                this.maritalStatusOptions = options;
                this.onButtonToggleClick();
            });*/

        // zip(this.store.select(leadSelector),this.typeListService
        // .getMaritalStatusOptions()).pipe(take(1), map(([lead, options]) => {

        // }));
    }

    onButtonToggleClick() {
        this.formGroupValue.emit({
            selected: this.formGroup.value,
        });
    }

    saveDetails() {
        this.formSubmit.emit(this.formGroup.value);
    }
}
