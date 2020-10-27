import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CallBackService } from '@services/call-back.service';
import { NavigationService } from '@services/navigation.service';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { PaymentStatusComponent } from './payment-status.component';





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

describe('PaymentStatusComponent', () => {
    let component: PaymentStatusComponent;
    let fixture: ComponentFixture<PaymentStatusComponent>;

    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };
    const mockCallbackService = {
        doCallBack: jasmine.createSpy('doCallBack').and.returnValue(of({ status: 'success' }))
    };
    const mockNavigationService = {
        navigate: jasmine.createSpy('navigate'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        upDateMarketingData: jasmine.createSpy('.upDateMarketingData')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaymentStatusComponent],
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
                { provide: NavigationService, useValue: mockNavigationService },
                { provide: CallBackService, useValue: mockCallbackService },
                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentStatusComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: mockDriver
                },
                quote: {
                    evoToken: { paymentToken: 'jhjhjhjhjj' }
                }
            }
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should naviagte to payer for doCallBack error response ', () => {
        mockCallbackService.doCallBack.and.returnValue(of({ error: 'error' }));
        component.triggerPaymentCallBackService('GGHHHG66');
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('payer', true);
    });
    it('should naviagte to payer for doCallBack service failuer  ', () => {
        mockCallbackService.doCallBack.and.returnValue(throwError(''));
        component.triggerPaymentCallBackService('GGHHHG66');
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('payer', true);
    });
});
