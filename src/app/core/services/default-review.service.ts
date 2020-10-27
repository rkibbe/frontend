import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DefaultReviewService {
    readonly coverageUrl = environment.nodeserver + 'products/coverages ';
    constructor(private httpClient: HttpClient) {}
    getCoverageDetails(): Observable<any> {
        return this.httpClient.get(this.coverageUrl);
    }
}
