import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { VertiMaterialModule } from 'src/app/shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NavigationService } from './core/services/navigation.service';
import { RouteService } from './core/services/route.service';
import { DataLayerService } from './core/services/data-layer.service';
import { SharedModule } from './shared/shared.module';


import * as fromStore from './store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router, convertToParamMap, NavigationEnd } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';
import { MilestonesAndBackbtnComponent } from './core/milestones-and-backbtn/milestones-and-backbtn.component';
import { HeaderComponent } from './core/header/header.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
let fixture: ComponentFixture<AppComponent>;
let app: AppComponent;
describe('AppComponent', () => {
    const mockRoutes = {
        routes: [
            {
                referringURL: '',
                routeName: 'basicinfo',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'contactinfo',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'homeaddress',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                rules: ['productUWRuleCheck', 'productAvailabiltyRuleCheck'],
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'previousaddress',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'maritalstatus',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'insurancecoverage',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'vehiclesummary',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                childRoutes: [
                    {
                        referringURL: '',
                        routeName: 'vehicleadd/:id',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    }
                ],
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'driversummary',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                childRoutes: [
                    {
                        referringURL: '',
                        routeName: 'driverbasicinfo/:id',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    },
                    {
                        referringURL: '',
                        routeName: 'drivermaritalstatus/:id',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    },
                    {
                        referringURL: '',
                        routeName: 'drivermajorviolation/:id',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    },
                    {
                        referringURL: '',
                        routeName: 'licensesuspended/:id',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    },
                    {
                        referringURL: '',
                        routeName: 'driverdrivinghistory/:id',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    }
                ],
                validateRules: false
            },
            {
                referringURL: '',
                routeName: 'relationship/:id',
                visible: true,
                preFill: true,
                generateQuickQuotePrice: false,
                rateQuote: false,
                finalizeQuote: false,
                updatePaymentPlan: false,
                evo: false,
                replaceUrl: false,
                validateDriver: false,
                validateRules: false
            }
        ]
    };
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        getRouteObjByName: jasmine.createSpy('getRouteObjByName').and.returnValue(of({ routeName: 'test route' })),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        makeChangesOnRouteNav: jasmine.createSpy('makeChangesOnRouteNav'),
        getRouteIndexByName: jasmine.createSpy('getRouteIndexByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        policyNumber: '3423423',
        getCurrentRouteIndex: jasmine.createSpy('getCurrentRouteIndex')
    };
    let mockStore: MockStore<any>;
    let navService: NavigationService;
    const initialState = {
        lead: fromStore.initialState,
        routes: mockRoutes,
        loader: { isLoading: false }
    };
    const mockActiatedRouter = {
        snapshot: {
            queryParamMap: convertToParamMap({
                LeadID: '2',
                campaignID: '2131222'
            })
        }
    };
    const lead = {
        'leadID': '00Q29000007Wsx5EAC',
        'publicID': 'pc:193067',
        'sessionUUID': 'c8b93af2-ed54-40bd-a26e-365a7d0ed48b',
        'genderCode': 'M',
        'genderValue': 'Male',
        'maritalStatusCode': 'S',
        'maritalStatusValue': 'Single',
        'primaryAddress': {
            'publicID': 'pc:435851',
            'displayName': '347 Oliver St, JERSEY SHORE, PA 17740',
            'addressLine1': '347 Oliver St',
            'city': 'JERSEY SHORE',
            'county': 'LYCOMING',
            'state': 'PA',
            'postalCode': '17740',
            'country': 'US',
            'addressType': 'home',
            'timeAtCurrentResidenceExt': 'greaterThan2Months',
            'isAddressVerified': true,
            'timeAtCurrentResidenceCode': 'greaterThan2Months'
        },
        'priorAddress': null,
        'primaryEmailAddress': 'john.p@verti.com',
        'phoneNumber': '',
        'quickQuote': {
            'quickQuoteNumber': null,
            'monthlyPremiumPrice': 345,
            'drivers': [
                {
                    'driverID': '00Q29000007Wsx5EAC-1',
                    'firstName': 'John',
                    'lastName': 'Papa',
                    'genderCode': 'M',
                    'genderValue': 'Male',
                    'age': 32,
                    'dateOfBirth': {
                        'year': 1987,
                        'month': 12,
                        'day': 12
                    },
                    'isIncluded': true,
                    'isPNI': true,
                    'maritalStatusCode': 'S',
                    'maritalStatusValue': 'Single',
                    'isADPF': false,
                    'isVisible': true,
                    'accidentsAndViolations': [

                    ],
                    'noOfAccidentsAndViolations': {
                        'noOfMovingViolations': 'none',
                        'noOfAtFaultAccidents': 'none',
                        'noOfNotAtFaultAccidents': 'none',
                        'noOfComprehensiveClaims': 'none'
                    },
                    'relationshipCode': '',
                    'relationshipValue': '',
                    'licenseState': 'PA',
                    'yearsLicensed': 'LessThan6Months',
                    'isQuoteDriver': true,
                    'licenseStatus': 'ValidLicense',
                    'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                    'yearsLicensedValue': 'Less than 6 months',
                    'person': {
                        'publicID': 'pc:193067'
                    },
                    'publicID': 'pc:447795'
                }, {
                    'driverID': '00Q29000007Wsx5EAC-2',
                    'firstName': 'John',
                    'lastName': 'Write',
                    'genderCode': 'M',
                    'genderValue': 'Male',
                    'age': 31,
                    'dateOfBirth': {
                        'year': 1989,
                        'month': 10,
                        'day': 12
                    },
                    'isIncluded': true,
                    'isPNI': false,
                    'maritalStatusCode': 'S',
                    'maritalStatusValue': 'Single',
                    'isADPF': false,
                    'isVisible': true,
                    'accidentsAndViolations': [

                    ],
                    'noOfAccidentsAndViolations': {
                        'noOfMovingViolations': 'none',
                        'noOfAtFaultAccidents': 'none',
                        'noOfNotAtFaultAccidents': 'none',
                        'noOfComprehensiveClaims': 'none'
                    },
                    'relationshipCode': '',
                    'relationshipValue': '',
                    'licenseState': 'PA',
                    'yearsLicensed': 'LessThan6Months',
                    'isQuoteDriver': true,
                    'licenseStatus': 'ValidLicense',
                    'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                    'yearsLicensedValue': 'Less than 6 months',
                    'person': {
                        'publicID': 'pc:193067'
                    },
                    'publicID': 'pc:447795'
                },
                {
                    'driverID': '00Q29000007Wsx5EAC-2',
                    'firstName': 'David',
                    'lastName': 'Warner',
                    'genderCode': 'M',
                    'genderValue': 'Male',
                    'age': 29,
                    'dateOfBirth': {
                        'year': 1990,
                        'month': 10,
                        'day': 12
                    },
                    'isIncluded': true,
                    'isPNI': false,
                    'maritalStatusCode': 'S',
                    'maritalStatusValue': 'Single',
                    'isADPF': false,
                    'isVisible': true,
                    'accidentsAndViolations': [

                    ],
                    'noOfAccidentsAndViolations': {
                        'noOfMovingViolations': 'none',
                        'noOfAtFaultAccidents': 'none',
                        'noOfNotAtFaultAccidents': 'none',
                        'noOfComprehensiveClaims': 'none'
                    },
                    'relationshipCode': '',
                    'relationshipValue': '',
                    'licenseState': 'PA',
                    'ownInsuranceApprovedExt': false,
                    'yearsLicensed': 'LessThan6Months',
                    'isQuoteDriver': true,
                    'licenseStatus': 'OwnInsurance',
                    'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                    'yearsLicensedValue': 'Less than 6 months',
                    'person': {
                        'publicID': 'pc:193067'
                    },
                    'publicID': 'pc:447798'
                }
            ],
            'vehicles': [
                {
                    'vehicleID': '00Q29000007Wsx5EAC-1',
                    'isIncluded': true,
                    'isADPF': false,
                    'isQuoteVehicle': true,
                    'isAlreadyIncluded': true,
                    'isVisible': true,
                    'year': 2018,
                    'make': 'BMW',
                    'model': '320',
                    'trim': 'I 4DR SEDAN AUTOMATIC',
                    'bodyStyleCode': 'SD',
                    'bodyStyle': 'SEDAN',
                    'stubbedVIN': 'WBA8A9C5*J*******',
                    'vinPrefix': 'WBA8A9C5*J*******',
                    'isStubbedVin': true,
                    'vin': 'WBA8A9C5*J*******',
                    'iconExisted': true,
                    'publicID': 'pc:246016',
                    'registeredState': 'PA',
                    'registeredOwner': 'John Papa',
                    'primaryUse': 'Commuting to Work or School',
                    'primaryUseCode': 'commuting',
                    'usedInRideSharing': false,
                    'rideShare': 'No',
                    'afterMarketDevice': 'No',
                    'passiveAlarm': 'No',
                    'commuteNYNJ': 'No',
                    'commutetoNYNJ': 'No',
                    'garagedAt': {
                        'publicID': 'pc:268902',
                        'addressLine1': '347 Oliver St',
                        'city': 'JERSEY SHORE',
                        'state': 'PA',
                        'postalCode': '17740',
                        'country': 'US',
                        'isAddressVerified': true
                    },
                    'garagingAddress': 'Residential',
                    'titleHolder': 'PaidFor',
                    'leaseOrRent': false,
                    'owned': true,
                    'additionalInterests': [

                    ]
                }
            ],
            'periodStartDate': {
                'year': 2020,
                'month': 6,
                'day': 30
            },
            'periodEndDate': {
                'year': 2020,
                'month': 12,
                'day': 31
            },
            'fullTermPremiumPrice': null,
            'policyTerm': '',
            'whatToDo': {
                'eligible': '',
                'referToPA': '',
                'knockOut': ''
            },
            'quoteStatus': null,
            'recordStatus': {
                'statusCode': '',
                'statusMessage': ''
            },
            'secondaryInsured': {
                'driverID': null,
                'email': null,
                'phone': null,
                'isSNISelected': null
            },
            'currentCarrier': {
                'currentInsurance': false,
                'lapseReason': '',
                'yearsInsuredValue': '',
                'bILimitFormatted': null
            }
        },
        'quote': {
            'quoteNumber': 'Q1000082338',
            'quoteStatus': null,
            'isADPFQuote': false,
            'eligibilityAnswers': {
                'ineligibleVehicle': '',
                'majorViolations': '',
                'licenseRevoked': ''
            },
            'premiumChangeIndicator': true,
            'currentInsuranceInfo': {
                'currentInsurance': false,
                'lastActiveInsurance': 'neverhadinsurance',
                'yearsInsured': '',
                'bILimits': '',
                'bILimitsValue': ''
            },
            'policyCoverage': {
                'bILimit': '',
                'uIMBILimit': '',
                'uMBILimit': '',
                'pDLimit': ''
            },
            'verificationDocuments': [{
                'title': 'Visual documentation',
                'docTypeId': 'veh_pictures'
            },
            {
                'title': 'Proof of driving history',
                'docTypeId': 'drive_hist_proof'
            }]
        },
        'marketingData': {
            'campaignID': 'WC100000092517',
            'leadSource': 'Fusion',
            'currentURL': 'https://konydev02.mapfreinsurance.com/car-insurance/#titleholder-select/00Q29000007Wsx5EAC-1',
            'referringURL': null,
            'zipCode': null,
            'mbsy': null,
            'leadID': '00Q29000007Wsx5EAC'
        },
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'validateDriver': false,
        'validateRules': false,
        'firstName': 'John',
        'lastName': 'Papa',
        'dateOfBirth': {
            'year': 1987,
            'month': 12,
            'day': 12
        },
        'enterprisePartyID': '0012900000Zg9koAAB',
        'gender': 'M',
        'residenceOwnership': 'rent',
        'residenceOwnershipValue': 'Rent',
        'noOfMovingViolations': 'none',
        'noOfAtFaultAccidents': 'none',
        'noOfNotAtFaultAccidents': 'none',
        'noOfComprehensiveClaims': 'none',
        'quoteRated': false,
        'maritalStatus': 'S'
    };
    const mockRouter = {
        naviagte: jasmine.createSpy('navigate')
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
                SharedModule,
                TranslateModule.forRoot()
            ],
            providers: [
                // { provide: NavigationService, useValue: mockNavigationService },
                NavigationService,
                { provide: RouteService, useValue: {} },
                {
                    provide: DataLayerService,
                    useValue: {
                        pushStepTotal: jasmine.createSpy('pushStepTotal')
                    }
                },

                provideMockStore({ initialState }),
                { provide: ActivatedRoute, useValue: mockActiatedRouter },
                {
                    provide: Router,
                    useValue: {
                        url: '/homeaddress?leadID=00Q29000005vqSNEAY',
                        events: of(
                            new NavigationEnd(
                                0,
                                'http://localhost:4200/#/non-pdp/phases/8',
                                'http://localhost:4200/#/non-pdp/phases/8'
                            )
                        ),
                        navigate: jasmine.createSpy('navigate')
                    }
                }
                // { provide: window, useValue: { dataLayer: { campaign_ID: '222424' } } }
            ],
            declarations: [AppComponent, MilestonesAndBackbtnComponent, FooterComponent, HeaderComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        document.createAttribute('body');
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        const dummyElement = document.createElement('div');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.debugElement.componentInstance;
        navService = TestBed.get(NavigationService);
    });

    it('should create the app', async(() => {
        expect(app).toBeTruthy();
    }));
    it(`should have as title 'app'`, async(() => {
        mockStore.setState({
            lead: {
                ...initialState,
                ...lead,
                quote: {
                    isADPFQuote: true,
                    quoteNumber: '343df44'
                }
            },
            routes: mockRoutes,
            loader: { isLoading: false }
        });
        app.ngOnInit();
        expect(navService.quoteNumber).toBe('343df44');
    }));
});
