import { TestBed } from '@angular/core/testing';

import { LicenseInfoStateService } from './license-info-state.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LeadService } from './lead.service';
import { Router, ActivatedRoute, convertToParamMap, RouterEvent, NavigationEnd } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TitleHolder, Vehicle, Driver, LicenseYears, LicenseStatus } from 'src/app/store/models/lead.model';
import { MatDialog } from '@angular/material';
import { of, ReplaySubject } from 'rxjs';
import { NavigationService } from './navigation.service';
import {
    UpdateGenerateQuickQuotePriceFlag,
    UpdateCustomQuoteAction,
    UpdateDriver
} from 'src/app/store/actions/lead.actions';

const leadData = {
    lead: {
        leadID: '00Q29000007WiX0EAK',
        publicID: 'pc:192948',
        sessionUUID: '4b3b6848-9511-410f-b0f8-1f7956b2286a',
        genderCode: 'M',
        genderValue: 'Male',
        maritalStatusCode: 'M',
        maritalStatusValue: 'Married',
        primaryAddress: {
            publicID: 'pc:435179',
            displayName: '12 Salamone Dr, JERSEY SHORE, PA 17740',
            addressLine1: '12 Salamone Dr',
            city: 'JERSEY SHORE',
            county: 'LYCOMING',
            state: 'PA',
            postalCode: '17740',
            country: 'US',
            addressType: 'home',
            timeAtCurrentResidenceExt: 'greaterThan2Months',
            isAddressVerified: true,
            timeAtCurrentResidenceCode: 'greaterThan2Months'
        },
        priorAddress: null,
        primaryEmailAddress: 'fsd@dssfs.gdd',
        phoneNumber: '3556576767',
        quickQuote: {
            quickQuoteNumber: null,
            drivers: [
                {
                    driverID: '00Q29000007WiX0EAK-1',
                    firstName: 'Kavink',
                    lastName: 'Sdfsddfsddsf',
                    genderCode: 'M',
                    genderValue: 'Male',
                    age: 11,
                    dateOfBirth: { year: 2009, month: 2, day: 13 },
                    isIncluded: false,
                    isPNI: true,
                    maritalStatusCode: 'M',
                    maritalStatusValue: 'Married',
                    isADPF: false,
                    isVisible: true,
                    accidentsAndViolations: [],
                    noOfAccidentsAndViolations: {
                        noOfMovingViolations: 'none',
                        noOfAtFaultAccidents: 'none',
                        noOfNotAtFaultAccidents: 'none',
                        noOfComprehensiveClaims: 'none'
                    },
                    relationshipCode: '',
                    relationshipValue: '',
                    licenseState: 'PA',
                    yearsLicensed: 'LessThan6Months',
                    isQuoteDriver: true,
                    licenseStatus: 'ValidLicense',
                    licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
                    yearsLicensedValue: 'Less than 6 months',
                    person: { publicID: 'pc:192948' },
                    publicID: 'pc:447252'
                },
                {
                    driverID: '00Q29000007WiX0EAK-2',
                    isIncluded: true,
                    isPNI: false,
                    isADPF: false,
                    isAlreadyIncluded: true,
                    firstName: 'df',
                    lastName: 'dddgfg',
                    genderCode: 'F',
                    dateOfBirth: { year: 1980, month: 3, day: 4 },
                    age: 40,
                    genderValue: 'Female',
                    maritalStatusCode: 'M',
                    maritalStatusValue: 'Married',
                    majorViolations: 'false',
                    licenseRevoked: 'false',
                    isVisible: true,
                    noOfAccidentsAndViolations: {
                        noOfMovingViolations: 'none',
                        noOfAtFaultAccidents: 'none',
                        noOfNotAtFaultAccidents: 'none',
                        noOfComprehensiveClaims: 'none'
                    },
                    accidentsAndViolations: [],
                    relationshipCode: 'SP',
                    relationshipValue: 'Spouse',
                    isQuoteDriver: true,
                    licenseStatus: 'ValidLicense',
                    licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
                    licenseState: 'PA',
                    yearsLicensed: 'LessThan6Months',
                    yearsLicensedValue: 'Less than 6 months',
                    person: { publicID: 'pc:192949' },
                    publicID: 'pc:447254'
                }
            ],
            vehicles: [
                {
                    vehicleID: '00Q29000007WiX0EAK-1',
                    isIncluded: true,
                    isADPF: false,
                    isQuoteVehicle: true,
                    isAlreadyIncluded: true,
                    isVisible: true,
                    year: 2020,
                    make: 'Acura',
                    model: 'ILX',
                    trim: 'DYNAMIC 4DR SEDAN ',
                    bodyStyleCode: 'SD',
                    bodyStyle: 'SEDAN',
                    stubbedVIN: '19VDE2E7*L*******',
                    vinPrefix: '19VDE2E7*L*******',
                    isStubbedVin: true,
                    vin: '19VDE2E7*L*******',
                    iconExisted: true,
                    publicID: 'pc:245727',
                    registeredState: 'PA',
                    registeredOwner: 'Kavink Sdfsddfsddsf',
                    primaryUse: 'Commuting to Work or School',
                    primaryUseCode: 'commuting',
                    usedInRideSharing: false,
                    rideShare: 'No',
                    afterMarketDevice: 'No',
                    passiveAlarm: 'No',
                    commuteNYNJ: 'No',
                    commutetoNYNJ: 'No',
                    garagedAt: {
                        publicID: 'pc:268610',
                        addressLine1: '12 Salamone Dr',
                        city: 'JERSEY SHORE',
                        state: 'PA',
                        postalCode: '17740',
                        country: 'US',
                        isAddressVerified: true
                    },
                    garagingAddress: 'Residential',
                    // titleHolder: 'PaidFor',
                    titleHolder: TitleHolder.LEASE,
                    leaseOrRent: false,
                    owned: true
                }
            ],
            periodStartDate: { year: 2020, month: 6, day: 25 },
            periodEndDate: { year: 2020, month: 12, day: 25 },
            monthlyPremiumPrice: null,
            fullTermPremiumPrice: null,
            policyTerm: '',
            whatToDo: { eligible: '', referToPA: '', knockOut: '' },
            quoteStatus: null,
            recordStatus: { statusCode: '', statusMessage: '' },
            secondaryInsured: { driverID: null, email: null, phone: null, isSNISelected: false },
            currentCarrier: {
                currentInsurance: false,
                lapseReason: '',
                yearsInsuredValue: '',
                bILimitFormatted: null
            }
        },
        quote: {
            quoteNumber: 'Q1000082128',
            quoteStatus: null,
            isADPFQuote: false,
            eligibilityAnswers: { ineligibleVehicle: '', majorViolations: '', licenseRevoked: '' },
            currentInsuranceInfo: {
                currentInsurance: false,
                lastActiveInsurance: 'neverhadinsurance',
                yearsInsured: '',
                bILimits: '',
                bILimitsValue: ''
            },
            policyCoverage: { bILimit: '', uIMBILimit: '', uMBILimit: '', pDLimit: '' }
        },
        marketingData: {
            campaignID: 'WC100000092517',
            leadSource: 'Fusion',
            currentURL: 'https://konydev02.mapfreinsurance.com/car-insurance/#policystartdate',
            referringURL: null,
            zipCode: null,
            mbsy: null,
            leadID: '00Q29000007WiX0EAK'
        },
        generateQuickQuotePrice: false,
        rateQuote: false,
        finalizeQuote: false,
        updatePaymentPlan: false,
        evo: false,
        validateDriver: false,
        validateRules: true,
        firstName: 'Kavink',
        lastName: 'Sdfsddfsddsf',
        dateOfBirth: { year: 2009, month: 2, day: 13 },
        enterprisePartyID: '0012900000ZXAIxAAP',
        gender: 'M',
        residenceOwnership: 'rent',
        residenceOwnershipValue: 'Rent',
        noOfMovingViolations: 'none',
        noOfAtFaultAccidents: 'none',
        noOfNotAtFaultAccidents: 'none',
        noOfComprehensiveClaims: 'none',
        quoteRated: true,
        maritalStatus: 'M',
        updateQuote: false
    }
};

describe('LicenseInfoStateService', () => {
    let service: LicenseInfoStateService;
    let mockStore: MockStore<any>;
    let newService;
    const initialState = { lead: fromStore.initialState };
    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockNavigationService = {
        navigate: jasmine.createSpy('navigate'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        registerBackHandler: jasmine.createSpy('registerBackHandler'),
        deregisterBackHandler: jasmine.createSpy('deregisterBackHandler'),
        currentRouteObj: { preFil: false }
    };
    const eventSubject = new ReplaySubject<RouterEvent>(1);
    // const routerMockRes = ['licenseinfoprerc'];
    const routerMock = {
        navigate: jasmine.createSpy('navigate'),
        events: eventSubject.asObservable(),
        url: 'test/url'
    };
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
            titleHolder: TitleHolder.LEASE,
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
    const mockDriver: Driver[] = [
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
        },
        {
            driverID: '00Q2900000987WiX0EAK-1',
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
    const mockedStore = {
        select() {
            return of(leadData);
        },
        dispatch() {}
    };
    let mockActivatedRoute = {
        params: of({ id: '00Q29000007WiX0EAK-1' }),
        url: { value: [{ path: 'licenseinfoprerc' }] }
    };

    const mockPartialData = {
        vehicleID: 'string',
        publicId: 'string',
        year: 'string',
        make: 'string',
        model: 'string',
        trim: 'string',
        vin: 'string'
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],

            providers: [
                LicenseInfoStateService,
                HttpClient,
                Store,
                { provide: Router, useValue: routerMock },
                { provide: NavigationService, useValue: mockNavigationService },
                provideMockStore({ initialState }),
                { provide: MatDialog, useValue: mockMatDialog },

                LeadService,
                // { provide: ActivatedRoute, useValue: {} },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute
                }
            ]
        });
        service = TestBed.get(LicenseInfoStateService);
        newService = service;
        eventSubject.next(new NavigationEnd(1, 'regular', 'redirectUrl'));
        mockStore = TestBed.get(Store) as MockStore<any>;
        // mockedStore = TestBed.get(Store);
        // mockedStore.select = jasmine.createSpy('select').and.returnValue(of(leadData));
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: [
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
                    ]
                },
                quote: {}
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call shouldShowPostRc method and CURR_ROUTE is licenseinfopre ', () => {
        const emptyDriver = {
            drivers: []
        };
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(emptyDriver));
        spyOn(service, 'shouldShowPostRc').and.callThrough();
        mockActivatedRoute.url.value[0].path = 'licenseinfopre';
        service.CURR_ROUTE = mockActivatedRoute.url.value[0].path;
        service.shouldShowPostRc(mockDriver[0]);
        expect(service.shouldShowPostRc).toHaveBeenCalledWith(mockDriver[0]);
        // console.log('CURR_ROUTE', service.CURR_ROUTE);
        // console.log('mockActivatedRoute.url ---', mockActivatedRoute.url.value[0].path);
        expect(service.CURR_ROUTE).toEqual('licenseinfopre');
        expect(mockActivatedRoute.url.value[0].path).toEqual('licenseinfopre');
    });
    it('should call shouldShowPostRc method and CURR_ROUTE is licenseinfoprerc', () => {
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockDriver));
        mockActivatedRoute.url.value[0].path = 'licenseinfoprerc';
        service.CURR_ROUTE = mockActivatedRoute.url.value[0].path;
        // spyOn(service, 'shouldShowPostRc').and.callThrough();
        //     service.shouldShowPostRc(mockDriver[0]);
        //     expect(service.shouldShowPostRc).toHaveBeenCalledWith(mockDriver[0]);
        // console.log('CURR_ROUTE----33---', service.CURR_ROUTE);
        // console.log('mockActivatedRoute.url ---33---', mockActivatedRoute.url.value[0].path);
        expect(service.CURR_ROUTE).toEqual('licenseinfoprerc');
        expect(mockActivatedRoute.url.value[0].path).toEqual('licenseinfoprerc');
    });
    it('should call getIncludedVehicles method and CURR_ROUTE is licenseinfoprerc', () => {
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockVehicle[0]));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        // newService.vehicles = mockVehicle;
        // mockActivatedRoute.url.value[0].path = 'licenseinfoprerc';
        // service.CURR_ROUTE = mockActivatedRoute.url.value[0].path;
        // spyOn(service, 'getIncludedVehicles').and.callThrough();
        service.getIncludedVehicles();
        //     expect(service.shouldShowPostRc).toHaveBeenCalledWith(mockDriver[0]);
        console.log('leasedLoanVehicles----22---', service.leasedLoanVehicles);
        console.log('nonAdpfIncludedVehicles----22---', service.nonAdpfIncludedVehicles);
        // console.log('mockActivatedRoute.url ---33---', mockActivatedRoute.url.value[0].path);
        // expect(service.CURR_ROUTE).toEqual('licenseinfoprerc');
        // expect(mockActivatedRoute.url.value[0].path).toEqual('licenseinfoprerc');
    });
    it('should call back()', () => {
        newService.drivers = mockDriver;
        const next = new Function();
        spyOn(service, 'back').and.callThrough();
        spyOn(newService, 'getNextDriver').and.callThrough();
        spyOn(newService, 'getCurrentDriver').and.callThrough();
        service.back(next);
        // console.log('drivers---33---', newService.drivers);
        // console.log('currentDriverID---33---', newService.currentDriverID);
        // console.log('result---33---', result);
        // console.log('result1---33---', result1());
        expect(service.back).toHaveBeenCalledWith(next);
        expect(newService.currentDriverID).toEqual(mockDriver[0].driverID);
    });
    it('should call shouldShowPostRc()', () => {
        spyOn(service, 'shouldShowPostRc').and.callThrough();
        service.shouldShowPostRc(mockDriver[0]);
        expect(service.shouldShowPostRc).toHaveBeenCalledWith(mockDriver[0]);
    });
    it('should call sortDrivers()', () => {
        const result = spyOn(service, 'sortDrivers').and.returnValue(of(-1));
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockDriver[0]));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        service.sortDrivers();
        expect(service.sortDrivers).toHaveBeenCalled();
        result().subscribe(item => {
            expect(item).toEqual(-1);
        });
    });
    describe('LicenseInfoStateService', () => {
        it('should return correct driverObservable ', () => {
            service['drivers'] = mockDriver;
            const result = service.sortDrivers();
        });
        it('should return correct driverObservable ', () => {
            service['drivers'] = mockDriver;
            const result = service.driverObservable;
        });
        it('should return current driver as NextDriver if dont have multiple drivers for getNextDriver method ', () => {
            service['drivers'] = mockDriver;
            service['currentDriverID'] = mockDriver[0].driverID;
            const result = service['getNextDriver'](0);
            expect(result).toEqual(mockDriver[0]);
        });
        it('should call continue() disaptch multiple actions', () => {
            service['drivers'] = mockDriver;
            service['currentDriverID'] = mockDriver[0].driverID;
            service.continue(mockDriver[0]);
            expect(mockNavigationService.upDateMarketingData).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalledWith(
                new UpdateDriver({
                    driverID: mockDriver[0].driverID,
                    isQuoteDriver: true,
                    ...mockDriver[0]
                })
            );
            expect(mockStore.dispatch).toHaveBeenCalledWith(
                new UpdateGenerateQuickQuotePriceFlag({
                    rateQuote: false,
                    finalizeQuote: false
                })
            );
        });
        it('should call navigate method if dont found nextRoute methods  ', () => {
            service['drivers'] = mockDriver;
            service['currentDriverID'] = 'trytyr';
            service.CURR_ROUTE = 'licenseinfopostrc';
            service.nonAdpfIncludedVehicles = [];
            service.leasedLoanVehicles = [];
            service.continue(mockDriver[0]);
            expect(mockNavigationService.upDateMarketingData).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(mockNavigationService.navigate).toHaveBeenCalled();
        });
        it('should call navigate method if dont found nextRoute methods  ', () => {
            service['drivers'] = mockDriver;
            service['currentDriverID'] = 'trytyr';
            service.CURR_ROUTE = 'licenseinfopostrc';
            service.nonAdpfIncludedVehicles = mockVehicle;
            service.leasedLoanVehicles = [];
            service.continue(mockDriver[0]);
            expect(mockNavigationService.upDateMarketingData).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalledWith(
                new UpdateGenerateQuickQuotePriceFlag({
                    rateQuote: false,
                    finalizeQuote: false
                })
            );
        });
    });
});
