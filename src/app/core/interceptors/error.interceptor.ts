import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs/index';
import { Store } from '@ngrx/store';
import * as ErrorActions from '@app/store/actions/error.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private store: Store<any>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                this.store.dispatch(new LoaderActions.StartLoaderAction());
                const customErrorObj = { code: error.status, message: error.message };
                this.store.dispatch(new ErrorActions.SetErrorAction(customErrorObj));
                return throwError(error);
            })
        );
    }
}
