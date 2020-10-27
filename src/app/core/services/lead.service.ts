import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
@Injectable({
    providedIn: 'root'
})
export class LeadService {
    constructor(private httpClient: HttpClient) {}
    saveLead(leadData) {
        leadData = { lead: leadData.payload };
        // return this.httpClient.put('https://e3720115-3cf4-473e-b840-b11b1f9b0c08.mock.pstmn.io/lead', leadData);
        return this.httpClient.post(environment.nodeserver + 'leadQuote', leadData);
    }
}
