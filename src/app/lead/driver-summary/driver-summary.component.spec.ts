import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { MatDialog } from '@angular/material';
import { DriverIconService } from '@services/driver-icon.service';
import { AppSettingsService } from '@services/app-settings.service';
import { DriverSummaryComponent } from './driver-summary.component';
import { of } from 'rxjs';
import { AppSettings } from '@shared/settings/app-settings';
import * as LeadActions from '@app/store/actions/lead.actions';
import { SpouseDPAlertModalComponent } from '@shared/spouse-dp-alert-modal/spouse-dp-alert-modal.component';

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
};
const mockMaritalStatusCode = {
    lead: {
        leadID: '00Q29000007WiX0EAK',
        publicID: 'pc:192948',
        sessionUUID: '4b3b6848-9511-410f-b0f8-1f7956b2286a',
        genderCode: 'M',
        genderValue: 'Male',
        maritalStatusCode: 'C',
        maritalStatusValue: 'Married',
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
                    isPNI: true
                }
            ],
            vehicles: []
        }
    }
};
const mockNoMaritalStatusCode = {
    lead: {
        leadID: '00Q29000007WiX0EAK',
        publicID: 'pc:192948',
        sessionUUID: '4b3b6848-9511-410f-b0f8-1f7956b2286a',
        genderCode: 'M',
        genderValue: 'Male',
        maritalStatusCode: undefined,
        maritalStatusValue: 'Married',
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
                    isPNI: true
                }
            ],
            vehicles: []
        }
    }
};
// tslint:disable-next-line: no-big-function
describe('DriverSummaryComponent', () => {
    let component: DriverSummaryComponent;
    let fixture: ComponentFixture<DriverSummaryComponent>;
    const description = 'makes expected calls';
    const appSetting = AppSettings;

    let appSettingsServiceStub;
    let mockedStore, matDialogStub;
    let driverCnt, mockNavigationService, driverNoGenderData, driverDataWithDOB;
    beforeEach(() => {
        appSettingsServiceStub = {
            getSettings() {
                return of(appSetting);
            }
        };
        driverCnt = [
            {
                driverID: '00Q29000007WiX0EAK-1',
                firstName: 'Kavink',
                lastName: 'Sdfsddfsddsf',
                genderCode: 'M',
                genderValue: 'Male',
                age: 11,
                dateOfBirth: { year: 2009, month: 2, day: 13 },
                isIncluded: true,
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
                isIncluded: false,
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
        ];
        driverNoGenderData = [
            {
                driverID: '00Q29000007WiX0EAK-1',
                firstName: 'Kavink',
                lastName: 'Sdfsddfsddsf',
                genderCode: '',
                genderValue: 'Male',
                age: 13
            },
            {
                driverID: '00Q29000007WiX0EAK-2',
                firstName: 'Dattu',
                lastName: 'ewew',
                genderCode: '',
                genderValue: '',
                age: 44
            }
        ];
        driverDataWithDOB = [
            {
                driverID: '00Q29000007WiX0EAK-1',
                firstName: 'Kavink',
                lastName: 'Sdfsddfsddsf',
                genderCode: 'M',
                genderValue: 'Male',
                age: undefined,
                dateOfBirth: { year: 2009, month: 2, day: 13 },
                isIncluded: true,
                isPNI: true,
                maritalStatusCode: 'M',
                maritalStatusValue: 'Married',
                isADPF: false,
                isVisible: true
            }
        ];

        mockNavigationService = {
            navigate: jasmine.createSpy('navigate'),
            upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
            saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
            navigateToSubRoute: jasmine.createSpy('navigateToSubRoute')
        };
        matDialogStub = {
            open: jasmine.createSpy('open'),
            close: jasmine.createSpy('close')
        };
        const driverIconServiceStub = { getDriverImageName: driver => ({}) };
        mockedStore = {
            select() {
                return of(leadData);
            },
            dispatch() {}
        };
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [DriverSummaryComponent, SpouseDPAlertModalComponent],
            providers: [
                { provide: Store, useValue: mockedStore },
                { provide: NavigationService, useValue: mockNavigationService },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: DriverIconService, useValue: driverIconServiceStub },
                { provide: AppSettingsService, useValue: appSettingsServiceStub }
            ]
        });
        fixture = TestBed.createComponent(DriverSummaryComponent);
        component = fixture.componentInstance;
        mockedStore = TestBed.get(Store);
        fixture.detectChanges();
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    it('should call getSettings on appSetting service', () => {
        appSettingsServiceStub.getSettings().subscribe(settings => {
            expect(component.appSettings).toEqual(settings);
        });
    });
    it('should get the driverCount from store', () => {
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(driverCnt));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        component.getDriverCount();
        fixture.detectChanges();
        expect(component.numberOfDrivers).toEqual(driverCnt);
    });
    it('should get the getDriversDetails from store', () => {
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(driverCnt));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        component.getDriversDetails();
        fixture.detectChanges();
        expect(component.driverData.length).toEqual(driverCnt.length);
    });
    it('should call the addDriver method', () => {
        const driver = {
            driverID: component.leadID + '-' + (component.numberOfDrivers + 1).toString(),
            isIncluded: false,
            isADPF: false,
            isAlreadyIncluded: false
        };
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(driverCnt));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        component.addDriver();
        fixture.detectChanges();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(new LeadActions.AddDriver(driver));
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalled();
    });

    it('should get the editDriver from store', () => {
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(driverCnt));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        const event = new Event('button');
        component.editDriver(event, driverCnt[0]);
        fixture.detectChanges();
        expect(driverCnt[0].driverID).toEqual('00Q29000007WiX0EAK-1');
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalledWith(driverCnt[0].driverID);
    });

    describe('ngOnInit', () => {
        it(description, () => {
            const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
            spyOn(component, 'getDriverCount').and.callThrough();
            spyOn(component, 'getIncludedDriverCount').and.callThrough();
            spyOn(component, 'getDriversDetails').and.callThrough();
            spyOn(storeStub, 'select').and.callThrough();
            component.ngOnInit();
            expect(component.getDriverCount).toHaveBeenCalled();
            expect(component.getIncludedDriverCount).toHaveBeenCalled();
            expect(component.getDriversDetails).toHaveBeenCalled();
            expect(storeStub.select).toHaveBeenCalled();
            expect(mockNavigationService.upDateMarketingData).toHaveBeenCalled();
        });
    });

    describe('customizeDriverData', () => {
        it(description, () => {
            component.driverData = driverNoGenderData;
            const driverIconServiceStub: DriverIconService = fixture.debugElement.injector.get(DriverIconService);
            component.customizeDriverData();
            spyOn(driverIconServiceStub, 'getDriverImageName').and.returnValue(driverNoGenderData);
            driverIconServiceStub.getDriverImageName(driverNoGenderData[0]);
            expect(driverIconServiceStub.getDriverImageName).toHaveBeenCalled();
        });
    });
    describe('getDriverCount', () => {
        it(description, () => {
            const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'select').and.callThrough();
            component.getDriverCount();
            expect(storeStub.select).toHaveBeenCalled();
        });
    });
    describe('getIncludedDriverCount', () => {
        it(description, () => {
            const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'select').and.callThrough();
            component.getIncludedDriverCount();
            expect(storeStub.select).toHaveBeenCalled();
        });
    });
    describe('saveAndNavigate', () => {
        it(description, () => {
            component.saveAndNavigate();
            expect(mockNavigationService.saveLeadAndNavigate).toHaveBeenCalled();
        });
    });
    describe('trackByFn', () => {
        it(description, () => {
            spyOn(component, 'trackByFn').and.callThrough();
            component.trackByFn(1, undefined);
            expect(component.trackByFn).toHaveBeenCalledWith(1, undefined);
        });
    });
    describe('splitPublicId', () => {
        it(description, () => {
            spyOn(component, 'splitPublicId').and.callThrough();
            const result = component.splitPublicId('pc:192948');
            expect(component.splitPublicId).toHaveBeenCalledWith('pc:192948');
            expect(result).toEqual('192948');
        });
    });
    describe('handleClick', () => {
        it(description, () => {
            spyOn(component, 'handleClick').and.callThrough();
            component.handleClick(driverCnt[0]);
            fixture.detectChanges();
            expect(component.handleClick).toHaveBeenCalledWith(driverCnt[0]);
            fixture.detectChanges();
            component.handleClick(driverCnt[1]);
            expect(component.handleClick).toHaveBeenCalledWith(driverCnt[1]);
        });
    });
    describe('removeDriver', () => {
        it(description, () => {
            const mockSNI = {
                driverID: '00Q29000007WiX0EAK-1',
                email: 'verti@verti.com',
                phone: 1234567890,
                isSNISelected: true
            };
            mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockSNI));
            mockedStore.dispatch = jasmine.createSpy('dispatch');
            fixture = TestBed.createComponent(DriverSummaryComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            spyOn(component, 'removeDriver').and.callThrough();
            component.removeDriver(driverCnt[0].driverID);
            fixture.detectChanges();
            expect(component.removeDriver).toHaveBeenCalledWith(driverCnt[0].driverID);
            expect(component.sni.driverID).toEqual(driverCnt[0].driverID);
        });
    });
    describe('addDriverBack', () => {
        it(description, () => {
            spyOn(component, 'addDriverBack').and.callThrough();
            component.addDriverBack(driverCnt[0]);
            fixture.detectChanges();
            expect(component.addDriverBack).toHaveBeenCalledWith(driverCnt[0]);
            expect(driverCnt[0].isAlreadyIncluded).toEqual(undefined);
        });
    });
    describe('getNonPNIIncludedDrivers', () => {
        it(description, () => {
            spyOn(component, 'getNonPNIIncludedDrivers').and.callThrough();
            component.getNonPNIIncludedDrivers(leadData.lead);
            fixture.detectChanges();
            expect(component.getNonPNIIncludedDrivers).toHaveBeenCalledWith(leadData.lead);
        });
    });

    describe('calcAge', () => {
        it(description, () => {
            spyOn(component, 'calcAge').and.callThrough();
            component.calcAge(driverCnt[0]);
            fixture.detectChanges();
            expect(component.calcAge).toHaveBeenCalledWith(driverCnt[0]);
        });
        it(description, () => {
            spyOn(component, 'calcAge').and.callThrough();
            component.calcAge(driverDataWithDOB);
            fixture.detectChanges();
            expect(driverDataWithDOB.age).toEqual(undefined);
            expect(component.calcAge).toHaveBeenCalledWith(driverDataWithDOB);
            expect(driverDataWithDOB[0].dateOfBirth.year).toEqual(2009);
        });
    });

    describe('saveDetails', () => {
        it(description, () => {
            mockedStore.select = jasmine.createSpy('select').and.returnValue(of(leadData.lead));
            mockedStore.dispatch = jasmine.createSpy('dispatch');
            spyOn(component, 'saveAndNavigate').and.callThrough();
            component.saveDetails();
            fixture.detectChanges();
            component.saveAndNavigate();
            expect(component.saveAndNavigate).toHaveBeenCalled();
        });
        it(description, () => {
            mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockMaritalStatusCode.lead));
            mockedStore.dispatch = jasmine.createSpy('dispatch');
            component.saveDetails();
            fixture.detectChanges();
            matDialogStub.open(SpouseDPAlertModalComponent, {
                data: 'leadData',
                panelClass: 'spouse-dp-alert'
            });
            expect(matDialogStub.open).toHaveBeenCalledWith(SpouseDPAlertModalComponent, {
                data: 'leadData',
                panelClass: 'spouse-dp-alert'
            });
        });
        it(description, () => {
            mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockNoMaritalStatusCode.lead));
            mockedStore.dispatch = jasmine.createSpy('dispatch');
            spyOn(component, 'saveAndNavigate').and.callThrough();
            component.saveDetails();
            fixture.detectChanges();
            component.saveAndNavigate();
            expect(component.saveAndNavigate).toHaveBeenCalled();
        });
    });
});
