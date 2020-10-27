import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BindPolicyService } from '@services/bind-policy.service';
import { CallBackService } from '@services/call-back.service';
import { NavigationService } from '@services/navigation.service';
import { SignFormsService } from '@services/sign-forms.service';
import { CreditCardComponent } from '@shared/credit-card/credit-card.component';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle, ViewPorts } from 'src/app/store/models/lead.model';
import { PaymentConfirmationComponent } from './payment-confirmation.component';

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

const mockPaymentPlans = {
    mobile: [
        {
            planId: 'pp:01',
            planName: 'Pay-in-Full',
            textDescription: 'PAY UP FRONT TO SAVE $284',
            totalAmt: '$1057',
            dueToday: '$1057',
            paymentSchedule: [
                {
                    'Today ': '$1057.00 Due'
                }
            ],
            displayOrder: '1',
            theme: 'primary',
            displaySize: 'large'
        },
        {
            planId: 'pp:02',
            planName: 'Monthly: 5-Payments',
            textDescription: '$211.4 DUE TODAY, THEN MONTYHLY STARTING ON 11/10',
            totalAmt: '$1057',
            dueToday: '$211.4',
            paymentSchedule: [
                {
                    Today: '$211.40 Due'
                },
                {
                    'November 10': '$211.40 Due'
                },
                {
                    'December 10': '$211.40 Due'
                },
                {
                    'January 11': '$211.40 Due'
                },
                {
                    'February 10': '$211.40 Due'
                }
            ],
            displayOrder: '2',
            theme: 'secondary',
            displaySize: 'large'
        },
        {
            planId: 'pp:06',
            planName: 'Monthly: 6-payments',
            textDescription: '$176.2 DUE TODAY, THEN MONTYHLY STARTING ON 09/10',
            totalAmt: '$1057',
            dueToday: '$176.2',
            paymentSchedule: [
                {
                    Today: '$176.20 Due'
                },
                {
                    'September 10': '$0.00 Due'
                },
                {
                    'October 12': '$176.16 Due'
                },
                {
                    'November 10': '$176.16 Due'
                },
                {
                    'December 10': '$176.16 Due'
                },
                {
                    'January 11': '$176.16 Due'
                },
                {
                    'February 10': '$176.16 Due'
                }
            ],
            displayOrder: '3',
            theme: 'tertiary',
            displaySize: 'large'
        }
    ],
    desktop: [
        {
            planId: 'pp:01',
            planName: 'Pay-in-Full',
            textDescription: 'PAY UP FRONT TO SAVE $284',
            totalAmt: '$1057',
            dueToday: '$1057',
            paymentSchedule: [
                {
                    Today: '$1057.00 Due'
                }
            ],
            displayOrder: '2',
            theme: 'primary',
            displaySize: 'large'
        },
        {
            planId: 'pp:02',
            planName: 'Monthly: 5-Payments',
            textDescription: '$211.4 DUE TODAY, THEN MONTYHLY STARTING ON 11/10',
            totalAmt: '$1057',
            dueToday: '$211.4',
            paymentSchedule: [
                {
                    Today: '$211.40 Due'
                },
                {
                    'November 10': '$211.40 Due'
                },
                {
                    'December 10': '$211.40 Due'
                },
                {
                    'January 11': '$211.40 Due'
                },
                {
                    'February 10': '$211.40 Due'
                }
            ],
            displayOrder: '1',
            theme: 'secondary',
            displaySize: 'large'
        },
        {
            planId: 'pp:06',
            planName: 'Monthly: 6-payments',
            textDescription: '$176.2 DUE TODAY, THEN MONTYHLY STARTING ON 09/10',
            totalAmt: '$1057',
            dueToday: '$176.2',
            paymentSchedule: [
                {
                    Today: '$176.20 Due'
                },
                {
                    'September 10': '$0.00 Due'
                },
                {
                    'October 12': '$176.16 Due'
                },
                {
                    'November 10': '$176.16 Due'
                },
                {
                    'December 10': '$176.16 Due'
                },
                {
                    'January 11': '$176.16 Due'
                },
                {
                    'February 10': '$176.16 Due'
                }
            ],
            displayOrder: '3',
            theme: 'tertiary',
            displaySize: 'large'
        }
    ],
    tablet: [
        {
            planId: 'pp:01',
            planName: 'Pay-in-Full',
            textDescription: 'PAY UP FRONT TO SAVE $284',
            totalAmt: '$1057',
            dueToday: '$1057',
            paymentSchedule: [
                {
                    Today: '$1057.00 Due'
                }
            ],
            displayOrder: '1',
            theme: 'primary',
            displaySize: 'large'
        },
        {
            planId: 'pp:02',
            planName: 'Monthly: 5-Payments',
            textDescription: '$211.4 DUE TODAY, THEN MONTYHLY STARTING ON 11/10',
            totalAmt: '$1057',
            dueToday: '$211.4',
            paymentSchedule: [
                {
                    Today: '$211.40 Due'
                },
                {
                    'November 10': '$211.40 Due'
                },
                {
                    'December 10': '$211.40 Due'
                },
                {
                    'January 11': '$211.40 Due'
                },
                {
                    'February 10': '$211.40 Due'
                }
            ],
            displayOrder: '2',
            theme: 'secondary',
            displaySize: 'large'
        },
        {
            planId: 'pp:06',
            planName: 'Monthly: 6-payments',
            textDescription: '$176.2 DUE TODAY, THEN MONTYHLY STARTING ON 09/10',
            totalAmt: '$1057',
            dueToday: '$176.2',
            paymentSchedule: [
                {
                    Today: '$176.20 Due'
                },
                {
                    'September 10': '$0.00 Due'
                },
                {
                    'October 12': '$176.16 Due'
                },
                {
                    'November 10': '$176.16 Due'
                },
                {
                    'December 10': '$176.16 Due'
                },
                {
                    'January 11': '$176.16 Due'
                },
                {
                    'February 10': '$176.16 Due'
                }
            ],
            displayOrder: '3',
            theme: 'tertiary',
            displaySize: 'large'
        }
    ]
};
describe('PaymentStatusComponent', () => {
    let component: PaymentConfirmationComponent;
    let fixture: ComponentFixture<PaymentConfirmationComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: {
            ...fromStore.initialState,
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
                quoteNumber: '424234333',
                paymentDetails: {
                    cardNumber: '323232323',
                    name: 'test name',
                    cardType: 'VISA'
                },
                selectedPaymentPlan: 'pp:02',
                monthlyPremium: '3232',
                // paymentPlans: mockPaymentPlans,
                nextPaymentDueDate: {
                    day: 22,
                    month: 10,
                    year: 2008
                }
            }
        }
    };
    // const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(''), close: null });
    // dialogRefSpyObj.componentInstance = { body: '' };
    const mockCallbackService = {
        doCallBack: jasmine.createSpy('doCallBack').and.returnValue(of({ status: 'success' }))
    };
    const mockNavigationService = {
        navigate: jasmine.createSpy('navigate'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        policyNumber: undefined
    };
    let getPosition, getIp;
    const getPositionRes = {
        lat: '67567677678',
        long: '8987778778788',
        addr: { formatted_address: 'jhjhjhkhh' }
    };
    let mockBindPolicy;
    let mockBindPolicyData;
    let deviceDetectorService, isDesktop, isTablet, isMobile;

    beforeEach(async(() => {
        mockBindPolicyData = {
            lead: {
                leadID: '242323',
                quote: {
                    quoteNumber: '424234333',
                    policyNumber: '120029002',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: 'pp:02',
                    monthlyPremium: '3232',
                    fullPremium: '1212',
                    // paymentPlans: mockPaymentPlans,
                    nextPaymentDueDate: {
                        day: 22,
                        month: 10,
                        year: 2008
                    }
                }
            }
        };
        TestBed.configureTestingModule({
            declarations: [PaymentConfirmationComponent, CreditCardComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                SharedModule,
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule
            ],
            providers: [
                DeviceDetectorService,
                { provide: NavigationService, useValue: mockNavigationService },
                { provide: CallBackService, useValue: mockCallbackService },
                provideMockStore({ initialState })
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(PaymentConfirmationComponent);
        component = fixture.componentInstance;
        getPosition = spyOn(TestBed.get(SignFormsService), 'getPosition').and.callFake(() =>
            Promise.resolve(getPositionRes)
        );
        deviceDetectorService = TestBed.get(DeviceDetectorService);
        getIp = spyOn(TestBed.get(SignFormsService), 'getIp').and.returnValue(of({ ip: '120.33.45.1' }));
        isTablet = spyOn(deviceDetectorService, 'isTablet');
        isDesktop = spyOn(deviceDetectorService, 'isDesktop');
        isMobile = spyOn(deviceDetectorService, 'isMobile');
        mockBindPolicy = spyOn(TestBed.get(BindPolicyService), 'bindPolicy').and.returnValue(of(mockBindPolicyData));
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
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
                    quoteNumber: '424234333',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: 'pp:01',
                    monthlyPremium: '3232',
                    paymentPlans: mockPaymentPlans,
                    nextPaymentDueDate: {
                        day: 22,
                        month: 10,
                        year: 2008
                    }
                }
            }
        });

        fixture.detectChanges();
    }));

    beforeEach(() => {});

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('ngOnInIt', () => {
        it('should have correct logitude , latitude and ip deatils ', () => {
            component.ngOnInit();
            expect(component.latitude).toEqual(getPositionRes.lat);
            expect(component.longitude).toEqual(getPositionRes.long);
            expect(component.formattedAddress).toEqual(getPositionRes.addr.formatted_address);
            expect(component.ipAddr).toEqual('120.33.45.1');
        });
        it('should have  logitude , latitude and ip deatils empty', fakeAsync(() => {
            getPosition.and.callFake(() => Promise.reject({ error: 'error' }));
            getIp.and.returnValue(throwError(''));
            component.ngOnInit();
            tick(100);
            expect(component.latitude).toEqual('');
            expect(component.longitude).toEqual('');
            expect(component.formattedAddress).toEqual('Location Access Denied');
        }));
    });
    describe('onSubmit ', () => {
        it('should dispatch PostLeadSuccessAction and should call naviagte method for bindPolicy success response   ', () => {
            spyOn(component, 'markTransactionComplete');
            component.onSubmit();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(mockNavigationService.navigate).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalledWith(new LeadActions.PostLeadSuccessAction(mockBindPolicyData));
        });
        it('should fullPremium take it as premium value if selectedPaymentPlan is not equal to "pp:02"', () => {
            const spy = spyOn(component, 'markTransactionComplete');
            mockBindPolicy.and.returnValue(
                of({
                    lead: {
                        leadID: '242323',
                        quote: {
                            quoteNumber: '424234333',
                            policyNumber: '120029002',
                            paymentDetails: {
                                cardNumber: '323232323',
                                name: 'test name',
                                cardType: 'VISA'
                            },
                            selectedPaymentPlan: 'pp:06',
                            monthlyPremium: '3232',
                            fullPremium: '1212',
                            paymentPlans: mockPaymentPlans,
                            nextPaymentDueDate: {
                                day: 22,
                                month: 10,
                                year: 2008
                            }
                        }
                    }
                })
            );
            component.onSubmit();
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith('1212', '242323');
        });
        it('should call gotoRouteByName method with "paymentfail" route name for bindPolicy error response   ', () => {
            spyOn(component, 'markTransactionComplete');
            mockBindPolicy.and.returnValue(of({ error: 'error' }));
            component.onSubmit();
            expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
            expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('paymentfail');
        });
        it('should call gotoRouteByName method with "paymentfail" route name for bindPolicy service failuer    ', () => {
            spyOn(component, 'markTransactionComplete');
            mockBindPolicy.and.returnValue(throwError(''));
            component.onSubmit();
            expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
            expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('paymentfail');
        });
    });
    it('get device with tablet device', () => {
        isTablet.and.returnValue(of(true));
        const result = component.getDeviceType();
        expect(result).toEqual('Tablet');
    });
    it('get device with Mobile device', () => {
        isMobile.and.returnValue(of(true));
        const result = component.getDeviceType();
        expect(result).toEqual('Mobile');
    });
    it('get device with Desktop device', () => {
        isDesktop.and.returnValue(of(true));
        const result = component.getDeviceType();
        expect(result).toEqual('Desktop');
    });
});
