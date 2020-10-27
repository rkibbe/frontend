import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ProjectFlow } from '@app/store/actions/route.actions';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(private httpClient: HttpClient) { }
    getConfiguration(projectFlow: ProjectFlow): Observable<Configuration> {
        const httpParam = new HttpParams()
            .set('stateCode', projectFlow.stateCode || '')
            .set('companyName', projectFlow.companyName || '');
        return this.httpClient
            .get<Configuration>(environment.nodeserver + 'config/appConfig', { params: httpParam })
            .pipe(catchError(_err => this.getConfigFallback()));
    }
    getConfigFallback() {
        return this.httpClient.get<Configuration>('assets/data/configuration.json');
    }
}
export interface Configuration {
    location: Location;
}
export interface Location {
    lattitude: number;
    longitude: number;
}
