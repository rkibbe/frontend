import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@app/store/models/route.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ProjectFlow } from '@app/store/actions/route.actions';

@Injectable({
    providedIn: 'root'
})
export class RouteService {
    constructor(private httpClient: HttpClient) {}
    landingRoute: string;
    getRoutes(param): Observable<Route[]> {
        const flowState: ProjectFlow = param.payload;
        const httpParam = new HttpParams()
            .set('routeType', flowState.routeType || 'organic')
            .set('stateCode', flowState.stateCode || '')
            .set('companyName', flowState.companyName || '');
        // return this.httpClient
        //     .get<{ [key: string]: Route[] }>('assets/data/routes.json')
        //     .pipe(map(res => res[param.payload || 'organic']));
        return this.httpClient.get<Route[]>(environment.nodeserver + 'routes', { params: httpParam });
    }
    getRoutesFromFallback() {
        return this.httpClient.get<Route[]>('assets/data/routes.json');
    }
}
