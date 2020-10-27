import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppSettingsService } from '@services/app-settings.service';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { QuoteService } from '@services/quote.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { AppSettings } from '@shared/settings/app-settings';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { QuotesFoundComponent } from './quotes-found.component';
import { TranslateModule } from '@ngx-translate/core';

const mockDriver: Driver[] = [
    {
        driverID: '00Q2900066007WiX0EAK-1',
        genderImg: 'string',
        licenseNumber: '65656565',
        firstName: 'Kavink',
        lastName: 'Sdfsddfsddsf',
        genderCode: 'F',
        genderValue: 'Male',
        age: '11',
        dateOfBirth: { year: 2009, month: 2, day: 13 },
        isIncluded: true,
        isPNI: true,
        maritalStatusCode: 'F',
        maritalStatusValue: 'Married',
        isADPF: false,
        isVisible: true,
        ownInsuranceApprovedExt: true,
        recordStatus: {
            statusCode: 45445,
            statusDescrition: 'string'
        },
        accidentsAndViolations: {
            accidentsAndViolationsId: 'string',
            violationCode: 'string',
            incidentType: 'string',
            incidentDate: {
                year: 2009,
                month: 5,
                day: 5
            },
            recordStatus: {
                statusCode: 45445,
                statusDescrition: 'string'
            },
            error: {
                code: '6565',
                errorDescription: 'string'
            }
        },
        noOfAccidentsAndViolations: {
            noOfMovingViolations: 'none',
            noOfAtFaultAccidents: 'none',
            noOfNotAtFaultAccidents: 'none',
            noOfComprehensiveClaims: 'none'
        },
        relationshipCode: '',
        relationshipValue: '',
        licenseState: 'PA',
        yearsLicensed: LicenseYears.LessThanSixMonths,
        isQuoteDriver: true,
        licenseStatus: LicenseStatus.NeverLicensed,
        licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
        yearsLicensedValue: 'Less than 6 months',
        publicId: 'pc:447252',
        error: {
            code: '6565',
            errorDescription: 'string'
        }
    },
    {
        driverID: '00Q29000007WiX0EAK-1',
        genderImg: 'string',
        licenseNumber: '65656565',
        firstName: 'Kavink',
        lastName: 'Sdfsddfsddsf',
        genderCode: 'M',
        genderValue: 'Male',
        age: '11',
        dateOfBirth: { year: 2009, month: 2, day: 13 },
        isIncluded: true,
        isPNI: true,
        maritalStatusCode: 'M',
        maritalStatusValue: 'Married',
        isADPF: false,
        isVisible: true,
        ownInsuranceApprovedExt: true,
        recordStatus: {
            statusCode: 45445,
            statusDescrition: 'string'
        },
        accidentsAndViolations: {
            accidentsAndViolationsId: 'string',
            violationCode: 'string',
            incidentType: 'string',
            incidentDate: {
                year: 2009,
                month: 5,
                day: 5
            },
            recordStatus: {
                statusCode: 45445,
                statusDescrition: 'string'
            },
            error: {
                code: '6565',
                errorDescription: 'string'
            }
        },
        noOfAccidentsAndViolations: {
            noOfMovingViolations: 'none',
            noOfAtFaultAccidents: 'none',
            noOfNotAtFaultAccidents: 'none',
            noOfComprehensiveClaims: 'none'
        },
        relationshipCode: '',
        relationshipValue: '',
        licenseState: 'PA',
        yearsLicensed: LicenseYears.LessThanSixMonths,
        isQuoteDriver: true,
        licenseStatus: LicenseStatus.NeverLicensed,
        licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
        yearsLicensedValue: 'Less than 6 months',
        publicId: 'pc:447252',
        error: {
            code: '6565',
            errorDescription: 'string'
        }
    }
];
const mockVehicle: Vehicle[] = [
    {
        // vehicleId = leadId-1
        vehicleID: 'string',
        publicId: 'string',
        year: 'string',
        make: 'string',
        model: 'string',
        trim: 'string',
        vin: 'string',
        bodyStyle: 'string',
        vinPrefix: 'string',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'string',
        stubbedVIN: 'string',
        isIncluded: true,
        isAlreadyIncluded: true,
        isADPF: true,
        isQuoteVehicle: true,
        recordStatus: {
            statusCode: 6776,
            statusDescrition: 'string'
        },
        error: {
            code: 'string',
            errorDescription: 'string'
        },
        unrepairDamage: true,
        leaseOrRent: true,
        owned: true,
        additionalInterests: [],
        titleHolder: TitleHolder.COMPANY,
        isVisible: true,
        isStubbedVin: true,
        compDeductible: 'string',
        compDisplayValue: 'string',
        selCodeComp: 'string',
        selValueComp: 'string',
        collDisplayValue: 'string',
        collDeductible: 'string',
        selValueColl: 'string',
        selCodeColl: 'string',
        displayRoadsideAssistance: true
    }
];

const mockData = {
    leadLandingScreen: 'drivinghistory',
    marketingData: { campaignID: '534353534' },
    enterprisePartyID: '5534353443',
    quote: { quoteNumber: '424234333' },
    firstName: 'test name',
    monthlyPremiumPrice: '4343',
    primaryEmailAddress: 'test@email.com',
    quickQuote: {
        monthlyPremiumPrice: '67',
        drivers: [
            {
                isPNI: true,
                isIncluded: true,
                licenseStatus: LicenseStatus.ValidLicense
            }
        ]
    },
    quoteSummary: {
        quotes: [
            {
                quoteNumber: '76767676',
                createdDate: '12/09/2009',
                monthlyPremium: '787',
                drivers: [
                    {
                        isPNI: true,
                        isIncluded: true,
                        licenseStatus: LicenseStatus.ValidLicense
                    }
                ],
                vehicles: [
                    {
                        isIncluded: false,
                        isADPF: true
                    }
                ],
                redirectRouteName: 'test name',
                quickQuoteNumber: '66767767',
                isQuickQuote: false
            }
        ]
    },
    leadSummary: {
        lead: { quickQuote: { redirectRouteName: 'test' } }
    }
};
const mockIsQuickQuoteTrue = {
    leadLandingScreen: 'drivinghistory',
    marketingData: { campaignID: '534353534' },
    enterprisePartyID: '5534353443',
    quote: { quoteNumber: '424234333' },
    firstName: 'test name',
    monthlyPremiumPrice: '4343',
    primaryEmailAddress: 'test@email.com',
    quickQuote: {
        monthlyPremiumPrice: '67',
        drivers: [
            {
                isPNI: true,
                isIncluded: true,
                licenseStatus: LicenseStatus.ValidLicense
            }
        ]
    },
    quoteSummary: {
        quotes: [
            {
                quoteNumber: '76767676',
                createdDate: '12/09/2009',
                monthlyPremium: '787',
                drivers: [
                    {
                        isPNI: true,
                        isIncluded: true,
                        licenseStatus: LicenseStatus.ValidLicense
                    }
                ],
                vehicles: [
                    {
                        isIncluded: false,
                        isADPF: true
                    }
                ],
                redirectRouteName: 'test name',
                quickQuoteNumber: '66767767',
                isQuickQuote: false
            }
        ]
    },
    leadSummary: {
        lead: { quickQuote: { redirectRouteName: 'test' } }
    }
};
const mockQuote = [
    {
        quoteNumber: '12345',
        timestamp: '123456678900',
        price: 123.55,
        names: 'abcd',
        cars: '',
        isQuickQuote: true,
        quickQuoteNumber: '',
        redirectRouteName: ''
    },
    {
        quoteNumber: '567890',
        timestamp: '987654321',
        price: 123.55,
        names: 'abcd',
        cars: '',
        isQuickQuote: true,
        quickQuoteNumber: '',
        redirectRouteName: ''
    }
];

describe('QuotesFoundComponent', () => {
    let component: QuotesFoundComponent;
    let fixture: ComponentFixture<QuotesFoundComponent>;
    let mockQuoteService, mockGetRoute;
    const mockLead = {
        lead: {
            quickQuote: { redirectRouteName: 'test' }
        },
        recoverQuote: {},
        routes: { routes: [] }
    };
    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const mockWindow = {
        dataLayer: []
    };
    const mockMatDialog = {
        open: jasmine.createSpy('open')
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    const settings = new AppSettings();
    const mockAappSettingsService = {
        getSettings: jasmine.createSpy('getSettings').and.returnValue(of(settings))
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QuotesFoundComponent, PageImageTitleComponent],
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
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                { provide: AppSettingsService, useValue: mockAappSettingsService },
                // {
                //     provide: NavigationService,
                //     useValue: {
                //         upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                //         saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
                //         gotoRouteByName: jasmine.createSpy('gotoRouteByName')
                //     }
                // },
                // { provide: Store, useValue: mockedStore },
                provideMockStore({ initialState })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuotesFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: { campaignID: '534353534' },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: mockVehicle,
                    drivers: mockDriver,
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {
                    quote: { quoteNumber: '424234333' }
                }
            },
            recoverQuote: {
                leadSummary: mockLead,
                quoteSummary: {
                    quotes: [
                        {
                            quoteNumber: 'string',
                            isQuickQuote: true,
                            fullPremium: 123,
                            monthlyPremium: 12,
                            drivers: 'string',
                            vehicles: 'string',
                            createdDate: 'string',
                            redirectRouteName: 'string'
                        }
                    ]
                }
            },
            routes: { routes: [{ visible: true }] }
        });
        mockGetRoute = spyOn(TestBed.get(NavigationService), 'gotoRouteByName');
        mockQuoteService = spyOn(TestBed.get(QuoteService), 'getQuote').and.returnValue(of(mockLead));
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should have initail data if values found in store ', () => {
        component.ngOnInit();
        expect(component.quotes[0].isQuickQuote).toEqual(true);
    });
    it('should have quickQuoteNumber empty if isQuickQuote value false  ', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: { campaignID: '534353534' },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: mockVehicle,
                    drivers: mockDriver,
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {
                    quote: { quoteNumber: '424234333' }
                }
            },
            recoverQuote: {
                leadSummary: mockData,
                quoteSummary: {
                    quotes: [
                        {
                            quoteNumber: 'string',
                            isQuickQuote: false,
                            fullPremium: 123,
                            monthlyPremium: 12,
                            drivers: 'string',
                            vehicles: 'string',
                            createdDate: 'string',
                            redirectRouteName: 'string'
                        }
                    ]
                }
            }
        });
        component.ngOnInit();
        expect(component.quotes[0].quickQuoteNumber).toEqual('');
    });
    it('should call formatedDate ', () => {
        const date = '10/12/2020';
        component.formatedDate(date);
        expect(component.formatedDate).toBeTruthy(true);
    });
    it('should call formatedDate with 13pm ', () => {
        const mockDate = '2012-01-26T13:51:50.417-07:00';
        component.formatedDate(mockDate);
        expect(component.formatedDate).toBeTruthy(true);
    });
    it('should call formatedDate with zero hours ', () => {
        const date1 = '2020, 10, 12, 0, 0, 0, 0';
        component.formatedDate(date1);
        expect(component.formatedDate).toBeTruthy(true);
    });
    it('should call getFirstQuote ', () => {
        component.quotes = mockQuote;
        fixture.detectChanges();
        const results = spyOn(component, 'getFirstQuote').and.returnValue(true);
        component.getFirstQuote();
        expect(results()).toEqual(true);
    });
    it('should call getPreviousQuotes ', () => {
        component.quotes = mockQuote;
        const getPreviousQuotesSpy = spyOn(component, 'getPreviousQuotes').and.returnValue(component.quotes.slice(1));
        fixture.detectChanges();
        component.getPreviousQuotes();
        expect(component.quotes.slice(1)).toEqual(getPreviousQuotesSpy());
    });
    it('should dispatch PostLeadSuccessAction for getQuote service success response ', () => {
        mockQuoteService.and.returnValue(of(mockLead));
        component.ngOnInit();
        component.continueQuoteHandler({ isQuickQuote: true });
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockGetRoute).toHaveBeenCalled();
        expect(mockGetRoute).toHaveBeenCalledWith('test');
        // expect(mockStore.dispatch).toHaveBeenCalledWith(new LeadActions.PostLeadSuccessAction(mockLead.lead));
    });
    it('should dispatch PostLeadSuccessAction for getQuote service success response ', () => {
        mockQuoteService.and.returnValue(of(mockLead));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(new LeadActions.PostLeadSuccessAction(mockLead));
    });
    it('should call gotoRouteByName method with personaldataalert for error response ', () => {
        mockQuoteService.and.returnValue(of({ error: { code: 651600 } }));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        fixture.detectChanges();
        expect(mockGetRoute).toHaveBeenCalled();
        expect(mockGetRoute).toHaveBeenCalledWith('personaldataalert');
    });
    it('should call gotoRouteByName method and numOfTimesErrorOccurredOnScreen count is morethan 3 ', () => {
        mockQuoteService.and.returnValue(of({ error: { code: 123456 } }));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        component.numOfTimesErrorOccurredOnScreen = 4;
        fixture.detectChanges();
        component.errorHandler();
        expect(component.numOfTimesErrorOccurredOnScreen).toBeGreaterThan(3);
    });
    it('should call gotoRouteByName method with kodecline for error response  610028', () => {
        mockQuoteService.and.returnValue(of({ error: { code: 610028 } }));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        expect(mockGetRoute).toHaveBeenCalled();
        expect(mockGetRoute).toHaveBeenCalledWith('kodecline');
    });
    it('should call gotoRouteByName method with kodecline for error response 610024 ', () => {
        mockQuoteService.and.returnValue(of({ error: { code: 610024 } }));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        expect(mockGetRoute).toHaveBeenCalled();
        expect(mockGetRoute).toHaveBeenCalledWith('contactus');
    });
    it('should show the TimeoutModalComponent for other error code', () => {
        mockQuoteService.and.returnValue(of({ error: { code: 6100 } }));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    });
    it('should show the TimeoutModalComponent for getRuote throwError error response ', () => {
        mockQuoteService.and.returnValue(throwError(''));
        component.continueQuoteHandler(mockData.quoteSummary.quotes[0]);
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    });
    it('should show the mockEmptyQuote for getRuote error response', () => {
        mockQuoteService.and.returnValue(of(mockLead));
        component.continueQuoteHandler(mockIsQuickQuoteTrue.quoteSummary.quotes[0]);
        expect(mockStore.dispatch).toHaveBeenCalledWith(new LeadActions.PostLeadSuccessAction(mockLead));
    });
    it('should call onStartNewQuoteClick', () => {
        component.visibleRouteList = [{ referringURL: 'tets url', routeName: 'test route', visible: true }];
        component.onStartNewQuoteClick();
        expect(mockGetRoute).toHaveBeenCalled();
        expect(mockGetRoute).toHaveBeenCalledWith('test route');
    });
});
