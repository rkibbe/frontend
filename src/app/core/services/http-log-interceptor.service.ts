import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SplunkService } from './splunk.service';

@Injectable({
    providedIn: 'root'
})
export class HttpLogInterceptorService implements HttpInterceptor {
    constructor(private splunkService: SplunkService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('mpv-splunk') === -1) {
            this.splunkService.log(req);
        }

        return next.handle(req).pipe(
            tap(evt => {
                if (
                    evt instanceof HttpResponse &&
                    evt.body &&
                    evt.status === 200 &&
                    evt.url.indexOf('mpv-splunk') === -1
                ) {
                    this.splunkService.log(evt);
                }
            })
        );
    }
}
