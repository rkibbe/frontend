import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LeadService } from '@services/lead.service';
import { SplunkService } from '@services/splunk.service';
import * as ErrorActions from '@app/store/actions/error.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { LeadActionTypes, PostLeadSuccessAction } from '../actions/lead.actions';
import { SignFormsService } from '@services/sign-forms.service';
import { AddressService } from '@services/address.service';
import { BindPolicyService } from '@services/bind-policy.service';
import { Lead } from '../models/lead.model';
@Injectable()
export class LeadEffects {
    constructor(
        private actions: Actions,
        private leadService: LeadService,
        private store: Store<any>,
        private splunkService: SplunkService,
        private signFormsService: SignFormsService,
        private addressService: AddressService,
        private bindPolicyService: BindPolicyService
    ) { }

    @Effect() saveLead$: Observable<Action | {}> = this.actions.pipe(
        ofType(LeadActionTypes.POST_LEAD),
        mergeMap(action => {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            return this.leadService.saveLead(action).pipe(
                this.mapFun(),
                this.catchErrorFun()
            );
        })
    );
    @Effect() signForm$: Observable<Action | {}> = this.actions.pipe(
        ofType(LeadActionTypes.SIGN_FORM),
        mergeMap(action => {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            return this.signFormsService.signForm(action).pipe(
                this.mapFun(),
                this.catchErrorFun()
            );
        })
    );
    @Effect() updateAddress$: Observable<Action | {}> = this.actions.pipe(
        ofType(LeadActionTypes.UPDATE_ADDRESS),
        mergeMap(action => {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            return this.addressService.updateAddress(action).pipe(
                this.mapFun(),
                this.catchErrorFun()
            );
        })
    );
    @Effect() bindPolicy$: Observable<Action | {}> = this.actions.pipe(
        ofType(LeadActionTypes.BIND_POLICY),
        mergeMap(action => {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            return this.bindPolicyService.bindPolicy(action).pipe(
                this.mapFun(),
                this.catchErrorFun()
            );
        })
    );
    mapFun() {
        return map((lead: Lead) => {
            if (!lead.error) {
                const noError = {
                    code: '',
                    message: ''
                };
                this.store.dispatch(new PostLeadSuccessAction(lead));
                this.store.dispatch(new ErrorActions.SetErrorAction(noError));
            } else {
                this.store.dispatch(new ErrorActions.SetErrorAction(lead.error));
                this.store.dispatch(new PostLeadSuccessAction(lead));
            }
            return new LoaderActions.StopLoaderAction();
        });
    }
    catchErrorFun() {
        return catchError(error => {
            this.splunkService.log(error);
            const customError = {
                code: 600,
                message: 'Service Failure/down'
            };
            this.store.dispatch(new ErrorActions.SetErrorAction(customError));
            this.store.dispatch(new LoaderActions.StopLoaderAction());
            return EMPTY;
        });
    }
}
