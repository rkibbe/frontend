import { TestBed } from '@angular/core/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { DataLayerService } from './data-layer.service';

let mockStore: MockStore<AppState>;
let service: DataLayerService;
const initialState = {
    lead: fromStore.initialState
};
describe('DataLayerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataLayerService,
                provideMockStore({ initialState })
            ]
        });
        window['dataLayer'] = [];
        mockStore = TestBed.get(Store) as MockStore<AppState>;
        service = TestBed.get(DataLayerService);
    });

    it('pushes party_id to dataLayer', () => {
        mockStore.setState({
            lead: {
                ...initialState.lead,
                enterprisePartyID: '009887A9887987898'
            }
        });
        expect(window['dataLayer'][0]['party_id']).toBe('009887A9887987898');
    });

    it('pushStepTotal method pushes current route & event to dataLayer', () => {
        service.pushStepTotal('login');
        expect(window['dataLayer'][0]['process_step_id']).toBe('login');
        expect(window['dataLayer'][1]['event']).toBe('step_view_event');
    });
    it('if gotLeadID is false  and leadID is not null, leadID will be pushed to dataLayer', () => {
        mockStore.setState({
            lead: {
                ...initialState.lead,
                leadID: '00Q29000005vqSNEAY'
            }
        });
        expect(window['dataLayer'][0]['lead_id']).toBe('00Q29000005vqSNEAY');
    });
});
