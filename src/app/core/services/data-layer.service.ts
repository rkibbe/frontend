import { Injectable } from '@angular/core';
import * as fromStore from '@app/store/reducers/lead.reducers';

import { Store } from '@ngrx/store';
import { Lead } from '@app/store/models/lead.model';
import { Subscription } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class DataLayerService {
    leadSub: Subscription;

    datalayer = {
        lead_id: '',
        process_step_id: '',
        party_id: '',
        operation_id_gw: '',
        operation_id_random: Math.random() * 1000000000000000 + '',
        age: '',
        gender: '',
        marital_status: '',
        zipcode: '',
        city: '',
        make: '',
        model: '',
        campaign_ID: ''
    };
    gotLeadID: boolean;
    constructor(private store: Store<any>) {
        this.gotLeadID = false;
        // to get Lead ID
        this.leadSub = this.store.select(fromStore.leadSelector).subscribe((leadData: Lead) => {
            this.datalayer.campaign_ID = leadData.marketingData['campaignID'];
            if (leadData.leadID !== null && !this.gotLeadID) {
                this.pushToDataLayer({
                    lead_id: leadData.leadID
                });
                this.gotLeadID = true;
            } else if (leadData.enterprisePartyID !== undefined) {
                this.pushToDataLayer({
                    party_id: leadData.enterprisePartyID,
                    operation_id_gw: leadData.quote.quoteNumber
                });
                this.unsubscribeLeadSub();
            }
        });
    }

    pushToDataLayer(pageDetails) {
        this.datalayer = { ...this.datalayer, ...pageDetails };
        window['dataLayer'].push(this.datalayer);
    }
    pushStepTotal(currentRoute) {
        /*   to collect data from all pages in data layer  */
        this.datalayer = { ...this.datalayer, process_step_id: currentRoute };

        window['dataLayer'].push(this.datalayer);

        window['dataLayer'].push({
            event: 'step_view_event'
        });
    }

    unsubscribeLeadSub() {
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
    }
}
