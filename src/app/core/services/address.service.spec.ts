import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppSettings } from '@shared/settings/app-settings';
import { of } from 'rxjs';
import { AddressService } from './address.service';
import { AppSettingsService } from './app-settings.service';

const leadData = {
    payload: {
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
                        titleHolder: 'PaidFor',
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
    }
};

xdescribe('AddressService', () => {
    let service: AddressService;
    let httpTestingController: HttpTestingController;
    const appSetting = AppSettings;
    let appSettingsServiceStub;
    beforeEach(() => {
        appSettingsServiceStub = {
            getSettings() {
                return of(appSetting);
            }
        };
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [AddressService, { provide: AppSettingsService, useValue: appSettingsServiceStub }]
        });
    });
    beforeEach(() => {
        service = TestBed.get(AddressService);
        service.appSettings = appSettingsServiceStub;
        httpTestingController = TestBed.get(HttpTestingController);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
