import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { PolicyStartDateComponent } from './policy-start-date.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PolicyStartDateComponent', () => {
    let component: PolicyStartDateComponent;
    let fixture: ComponentFixture<PolicyStartDateComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const mockData = {
        leadLandingScreen: 'drivinghistory',
        marketingData: { campaignID: '534353534' },
        enterprisePartyID: '5534353443',
        quote: { quoteNumber: '424234333' },
        firstName: 'test name',
        monthlyPremiumPrice: '4343',
        primaryEmailAddress: 'test@email.com',
        periodStartDate: {
            year: '2007',
            month: '07',
            day: '07'
        }
    };
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };
    const mockWindow = {
        dataLayer: []
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        currentRouteObj: { preFill: true }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolicyStartDateComponent, PageImageTitleComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot({}),
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: window, useValue: mockWindow },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                {
                    provide: NavigationService,
                    useValue: mockNavigationService
                },
                // { provide: Store, useValue: mockedStore }
                provideMockStore({ initialState })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: { campaignID: '534353534' },
                phoneNumber: '123131321',
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: [],
                    drivers: [],
                    periodStartDate: {
                        year: 2009,
                        month: 12,
                        day: 12
                    }
                },
                quote: {
                    quoteNumber: '424234333',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                }
            }
        });

        fixture = TestBed.createComponent(PolicyStartDateComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    beforeEach(() => {});

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct deatils if values found in store ', () => {
        expect(component.phoneNum).toEqual('123131321');
    });
    it('should dispatch UpdateGenerateQuickQuotePriceFlag, UpdatePolicyStartDateAction and naviagte to next for saveDetails ', () => {
        component.saveDetails();
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockNavigationService.saveLeadAndNavigate).toHaveBeenCalled();

        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdatePolicyStartDateAction({ year: 2009, month: 12, day: 12 })
        );
    });
    it('should  dispatch UpdateGenerateQuickQuotePriceFlag if phoneNumber not found in store  for saveDetails ', () => {
        component.phoneNum = undefined;
        component.saveDetails();
        expect(mockNavigationService.saveLeadAndNavigate).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateGenerateQuickQuotePriceFlag({ rateQuote: false, validateRules: false })
        );
    });
});
