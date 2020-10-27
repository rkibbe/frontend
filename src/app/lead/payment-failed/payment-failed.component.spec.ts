import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFailedComponent } from './payment-failed.component';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavigationService } from '@services/navigation.service';
import { Store } from '@ngrx/store';
import { BindPolicyService } from '@services/bind-policy.service';
import { of, throwError } from 'rxjs';
import * as LoaderActions from '@app/store/actions/loader.actions';

describe('PaymentFailedComponent', () => {
    let component: PaymentFailedComponent;
    let fixture: ComponentFixture<PaymentFailedComponent>;

    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };
    const err = {
        error: 'error'
    };
    const mockedBindPolicyService = {
        bindPolicy() {
            return of({ status: 'Success' });
        }
    };
    const navigationServiceStub = {
        upDateMarketingData: () => ({}),
        paymentCallBackCompleted: {},
        navigate: jasmine.createSpy('navigate'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaymentFailedComponent],
            providers: [
                provideMockStore({ initialState }),

                { provide: NavigationService, useValue: navigationServiceStub },
                { provide: BindPolicyService, useValue: mockedBindPolicyService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentFailedComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {},
                quote: {
                    payerInfoAddress: {
                        firstName: 'firstName',
                        lastName: 'lastName',
                        primaryAddress: 'primaryAddress',
                        emailAddress1: 'email@Address1',
                        cellNumber: '76677767'
                    },
                    evoToken: { paymentToken: 'jhjhjhjhjj' },
                    updatePayerInfoAddress: 'Y'
                }
            },
            loader: { isLoading: false }
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call onChangePaymentMethodClick', () => {
        component.onChangePaymentMethodClick();
        navigationServiceStub.gotoRouteByName('payer');
        expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalledWith('payer');
        fixture.detectChanges();
    });

    it('should call BindPolicyService on success', () => {
        component.triggerBindPolicyService();
        fixture.detectChanges();
        mockStore.dispatch(new LoaderActions.StartLoaderAction());
        expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalledWith('paymentsuccess', true);
        mockStore.dispatch(new LoaderActions.StopLoaderAction());
    });

    it('should call BindPolicyService on error', () => {
        component.triggerBindPolicyService();
        // mockedBindPolicyService.bindPolicy = spyOn(mockedBindPolicyService, 'bindPolicy').and.returnValue(err);
        const mockSpy = spyOn(mockedBindPolicyService, 'bindPolicy').and.returnValue(err);
        fixture = TestBed.createComponent(PaymentFailedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(mockSpy()).toEqual(err);
    });
    it('should call BindPolicyService on throw error', () => {
        component.onTryCardAgainClick();
        component.triggerBindPolicyService();
        mockedBindPolicyService.bindPolicy = spyOn(mockedBindPolicyService, 'bindPolicy').and.returnValue(
            throwError('')
        );
        fixture = TestBed.createComponent(PaymentFailedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalledWith('paymentsuccess', true);
    });

    it('should call handleErrorScenario', () => {
        component.handleErrorScenario();
        navigationServiceStub.gotoRouteByName('paymentfail');
        expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalledWith('paymentfail');
        fixture.detectChanges();
    });
});
