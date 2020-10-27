import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { environment } from '@env/environment';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Driver, LicenseStatus, LicenseYears } from 'src/app/store/models/lead.model';
import { LicenseNumberValidationService } from './license-number-validation.service';


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
        licenseNumber: '656565685',
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

describe('LicenseNumberValidationService', () => {
    const initialState = {
        lead: fromStore.initialState,
        error: { code: '', message: '' },
        routes: []
    };
    let service: LicenseNumberValidationService;
    let httpTestingController: HttpTestingController;
    let mockStore: MockStore<any>, newService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],
            providers: [LicenseNumberValidationService, HttpClient, provideMockStore({ initialState })]
        });
        service = TestBed.get(LicenseNumberValidationService);
        httpTestingController = TestBed.get(HttpTestingController);
        newService = service;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            ...initialState,
            lead: {
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: [],
                    drivers: mockDriver,
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
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
            },
            routes: []
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should make http call with correct params if dont find any value in cached', () => {
        service.validateLicenseNumber('PA', '6656667', '00Q2900066007WiX0EAK-1').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'driver/license?licenseNumber=6656667&stateCode=PA'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ apiOutput: { result: { status: 'SUCCESS' } } });
        spyOn(service, 'isDuplicateLicenseNumber').and.returnValue(true);
        service.isDuplicateLicenseNumber('65656565');
        const res = { apiOutput: { result: { status: 'SUCCESS' } } };
        const result = { licenseNumberDuplicate: 'License number already used' };
        const mockSpy = spyOn(newService, 'mapResponseToErrorObj').and.returnValue(result);
        newService.mapResponseToErrorObj(res);
        expect(mockSpy()).toEqual(result);
    });
    it('should not make http call  if  have any value in cached and should return that value', () => {
        service.cache = [
            {
                id: {
                    stateCode: 'PA',
                    licenseNumber: '6656667'
                },
                value: {
                    licenseNumber: {
                        message: 'test message'
                    }
                }
            }
        ];
        service.validateLicenseNumber('PA', '6656667', '00Q2900066007WiX0EAK-1').subscribe(data => {
            expect(data).toEqual({ licenseNumber: { message: 'test message' } });
        });
    });
    it('should not make http call  if  have any value in cached and should return that value', () => {
        service.cache = [
            {
                id: {
                    stateCode: 'PA',
                    licenseNumber: '6656667'
                },
                value: undefined
            }
        ];
        service.validateLicenseNumber('PA', '6656667', '00Q2900066007WiX0EAK-1').subscribe(data => {
            expect(data).toEqual(undefined);
        });
        expect(service.isDuplicateLicenseNumber('65656565')).toEqual(0);
    });
    it('should "License number already used" message for duplicate license number', () => {
        service.cache = [
            {
                id: {
                    stateCode: 'PA',
                    licenseNumber: '6656667'
                },
                value: undefined
            }
        ];
        const result = spyOn(service, 'isDuplicateLicenseNumber').and.returnValue(true);
        service.includedDrivers = mockDriver;
        service.validateLicenseNumber('PA', '65656565', '00Q2900066007WEAK-1').subscribe(data => {
            expect(data).toEqual({ licenseNumberDuplicate: 'License number already used' });
        });
        service.isDuplicateLicenseNumber('65656565');
        expect(result()).toEqual(service.isDuplicateLicenseNumber('65656565'));
    });
    it('should return isDuplicateLicenseNumber() true', () => {
        service.cache = [
            {
                id: {
                    stateCode: 'PA',
                    licenseNumber: '6656667'
                },
                value: undefined
            }
        ];
        service.includedDrivers = mockDriver;
        const result = spyOn(service, 'isDuplicateLicenseNumber').and.returnValue(true);
        service.validateLicenseNumber('PA', '65656565', '00Q2900066007WEAK-1').subscribe(data => {
            service.isDuplicateLicenseNumber('65656565');
            expect(data).toEqual({ licenseNumberDuplicate: 'License number already used' });
        });
        expect(result()).toEqual(service.isDuplicateLicenseNumber('65656565'));
    });

    it('should "License number already used" message for duplicate license number', () => {
        service.includedDrivers = mockDriver;
        service.validateLicenseNumber('PA', '65656565', '00Q2900066007iX0EAK-1').subscribe(data => {
            expect(data).toEqual({ licenseNumberDuplicate: 'License number already used' });
        });
    });
});
