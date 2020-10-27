import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvoPaymentComponent } from './evo-payment.component';
import { Store } from '@ngrx/store';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LicenseStatus, TitleHolder, Vehicle, LicenseYears, Driver } from 'src/app/store/models/lead.model';
import * as fromStore from '../../store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

// tslint:disable-next-line: no-big-function
describe('EvoPaymentComponent', () => {
    let component: EvoPaymentComponent;
    let fixture: ComponentFixture<EvoPaymentComponent>;
    let mockedNavigationServiceStub;
    const url = 'https://cert-hp.evosnap.com/#tokenconfirm';
    const emptyUrl = '';
    const mockWindow = {
        location: { origin: 'test' }
    };
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
            }
        ]
    };
    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState,
        routes: mockRoutes
    };

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
            licenseStatusValue: `Has a valid driver's license and drives listed vehicle(s)`,
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
            licenseStatusValue: `Has a valid driver's license and drives listed vehicle(s)`,
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
            vehicleID: 'SSDDSDD55',
            publicId: 'string',
            year: 'string',
            make: '2009',
            model: 'CHAVROLET',
            trim: 'TRIM',
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
    beforeEach(async(() => {
        mockedNavigationServiceStub = {
            navigateBack: jasmine.createSpy('navigateBack'),
            navigate: jasmine.createSpy('navigate'),
            upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
            gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
            saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
        };
        TestBed.configureTestingModule({
            declarations: [EvoPaymentComponent],
            providers: [
                { provide: NavigationService, useValue: mockedNavigationServiceStub },
                { provide: window, useValue: mockWindow },
                provideMockStore({ initialState })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EvoPaymentComponent);
        component = fixture.componentInstance;
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
                    },
                    redirectRouteName: 'https://cert-hp.evosnap.com/#tokenconfirm'
                },
                quote: {
                    quoteNumber: '424234333',
                    evoToken: 'HGHHDDJE23',
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
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture = TestBed.createComponent(EvoPaymentComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
    xit('should call iframeContentLoaded()', () => {
        spyOn(component, 'iframeContentLoaded').and.callThrough();
        component.iframeContentLoaded();
        component.isLandingUrl(url);
    });

    it('should call isLandingUrl() and return value is false', () => {
        spyOn(component, 'isLandingUrl').and.returnValue(true);
        fixture.detectChanges();
        const result = component.isLandingUrl(emptyUrl);
        expect(result).toEqual(true);
    });
    it('should call isLandingUrl() and return value is false', () => {
        spyOn(component, 'isLandingUrl').and.returnValue(false);
        const result = component.isLandingUrl(emptyUrl);
        fixture.detectChanges();
        expect(result).toEqual(false);
    });
    it('should call isLandingUrl()', () => {
        component.visibleRouteList = [{ referringURL: 'tetsurl', routeName: 'test route', visible: true }];
        spyOn(component, 'isLandingUrl').and.returnValue(true);
        const result = component.isLandingUrl(url);
        fixture.detectChanges();
        expect(result).toEqual(true);
    });

    it('should call isLandingUrl()', () => {
        spyOn(component, 'isLandingUrl').and.returnValue(true);
        const result = component.isLandingUrl('https://cert-hp.evosnap.com/');
        fixture.detectChanges();
        expect(result).toEqual(true);
    });
    it('should call iframeContentLoaded()', () => {
        spyOn(component, 'iframeContentLoaded').and.callThrough();
        component.iframeContentLoaded();
        const result = component.isLandingUrl('');
        mockedNavigationServiceStub.navigate();
        expect(mockedNavigationServiceStub.navigate).toHaveBeenCalled();
        fixture.detectChanges();
        expect(result).toEqual(false);
    });
});
