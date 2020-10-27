import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationService } from '@app/core/services/navigation.service';
import { BillingAddressComponent } from './billing-address.component';

import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as LeadActions from '@app/store/actions/lead.actions';

describe('BillingAddressComponent', () => {
    let component: BillingAddressComponent;
    let fixture: ComponentFixture<BillingAddressComponent>;
    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };
    const navigationServiceStub = {
        upDateMarketingData: () => ({}),
        paymentCallBackCompleted: {},
        navigate: jasmine.createSpy('navigate'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [BillingAddressComponent],
            providers: [
                //   { provide: Store, useValue: storeStub },
                provideMockStore({ initialState }),

                { provide: NavigationService, useValue: navigationServiceStub }
            ]
        });
        fixture = TestBed.createComponent(BillingAddressComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {},
                quote: {
                    billingAddress: {
                        publicId: 'string',
                        addressLine1: 'string',
                        addressLine2: 'string',
                        city: 'string',
                        state: 'string',
                        postalCode: 'string',
                        county: 'string',
                        country: 'string',
                        isAddressVerified: true
                    },
                    updateBillingAddress: true
                }
            },
            loader: { isLoading: false }
        });
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    it('residentialControl should set as "Y" if BillingAddress empty and updateBillingAddress false  ', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {},
                quote: {
                    updateBillingAddress: false
                }
            }
        });
        component.ngOnInit();
        expect(component.residentialControl.value).toEqual('Y');
    });
    it('showAddressForm defaults to: false', () => {
        expect(component.showAddressForm).toEqual(false);
    });
    it('AddressForm should hide if value equels to "Y" on click of onButtonToggleClick', () => {
        component.onButtonToggleClick('Y', true);
        expect(component.showAddressForm).toEqual(false);
    });
    it('should dispatc SaveQuote Action and navigate to next step on click saveBillingAddess', () => {
        component.loaderStopped = false;
        component.saveBillingAddess({
            publicId: 'string',
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            county: 'string',
            country: 'string',
            isAddressVerified: true
        });
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SaveQuote({
                billingAddress: {
                    publicId: 'string',
                    addressLine1: 'string',
                    addressLine2: 'string',
                    city: 'string',
                    state: 'string',
                    postalCode: 'string',
                    county: 'string',
                    country: 'string',
                    isAddressVerified: true
                }
            })
        );
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'select').and.callThrough();
            component.ngOnInit();
            expect(storeStub.select).toHaveBeenCalled();
        });
    });
    describe('updateEvoTokenInfo', () => {
        it('makes expected calls', () => {
            component.updateEvoTokenInfo();
            expect(mockStore.dispatch).toHaveBeenCalled();
        });
    });
});
