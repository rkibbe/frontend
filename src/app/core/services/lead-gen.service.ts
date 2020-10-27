import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class LeadGenService {
    private leadGenServiceUrl = environment.nodeserver + 'leadGen/lead';
    constructor(private httpClient: HttpClient) {}
    getLeadGen(leadID, qqID) {
        return this.httpClient.get(this.leadGenServiceUrl, { params: this.setParams(leadID, qqID) });
    }
    setParams(leadID, qqID) {
        return qqID ? new HttpParams().set('leadID', leadID).set('qqID', qqID) : new HttpParams().set('leadID', leadID);
    }
}
