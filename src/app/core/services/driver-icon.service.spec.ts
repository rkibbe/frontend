import { TestBed } from '@angular/core/testing';

import { DriverIconService } from './driver-icon.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears } from 'src/app/store/models/lead.model';

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
const mockNewDriver: Driver[] = [
    {
        driverID: '00Q2900000789WiX0EAK-1',
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

const mockNoDriverId: Driver[] = [
    {
        driverID: undefined,
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

describe('DriverIconService', () => {
    let service: DriverIconService;

    const mockedStore = {
        select() {
            return of(mockDriver);
        },
        dispatch() {}
    };

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Store,
                    useValue: mockedStore
                },
                DriverIconService
            ],
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})]
        })
    );
    beforeEach(() => {
        service = TestBed.get(DriverIconService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should return correct driver image name', () => {
        const result = service.getDriverImageName(mockDriver[0]);
        expect(result).toEqual('male-1');
    });
    it('should return undefined', () => {
        const defaultVal = undefined;
        const result = service.getDriverImageName(mockNoDriverId[0], defaultVal);
        expect(result).toEqual(defaultVal + '-1');
    });
    it('should return empty value', () => {
        const defaultVal = '';
        const result = service.getDriverImageName(mockNoDriverId[0], defaultVal);
        expect(result).toEqual('');
    });
    it('should return correct removed Drivers', () => {
        service['updateImageUsage'](mockNewDriver);
        expect(service['imageNameToUsage']).toEqual({
            'male-1': 0,
            'male-2': 0,
            'male-3': 0,
            'male-4': 0,
            'female-1': 0,
            'female-2': 0,
            'female-3': 0,
            'female-4': 0,
            'undefined-1': 0,
            'undefined-2': 0
        });
    });
    it('should return correct new Drivers', () => {
        const result = service['getNewDrivers'](mockNewDriver);
        expect(result).toEqual(mockNewDriver);
    });
    it('should return correct new Drivers', () => {
        mockNewDriver[0].driverID = '00Q2900000987WiX0EAK-1';
        const result = service['getUpdatedDrivers'](mockNewDriver);
        expect(result).toEqual([]);
    });
    it('should return correct gender codes ', () => {
        mockNewDriver[0].driverID = '00Q2900000987WiX0EAK-1';
        mockNewDriver[0].genderCode = 'F';
        service['updateChangedDrivers'](mockNewDriver);
        expect(service['driverToImageName']).toEqual({
            '00Q29000007WiX0EAK-1': 'male-1',
            '00Q2900000987WiX0EAK-1': 'female-1'
        });
    });
    it('should return gender as undefined if driver gender is undefined ', () => {
        mockNewDriver[0].driverID = '00Q2900000987WiX0EAK-1';
        mockNewDriver[0].genderCode = undefined;
        const result = service['mapDriverToImage'](mockNewDriver[0]);
        expect(result).toEqual('undefined-1');
    });
});
