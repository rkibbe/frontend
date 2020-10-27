import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, convertToParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../core/services/navigation.service';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '../../core/services/data-layer.service';
import { DriverMajorViolationsComponent } from './driver-major-violations.component';
import { of } from 'rxjs';
import * as fromStore from '../../store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TitleHolder, Vehicle, LicenseStatus, LicenseYears, Driver } from 'src/app/store/models/lead.model';

describe('DriverMajorViolationsComponent', () => {
    let component: DriverMajorViolationsComponent;
    let fixture: ComponentFixture<DriverMajorViolationsComponent>;

    const formBuilder: FormBuilder = new FormBuilder();
    beforeEach(() => {
        const formBuilderStub = { group: object => ({}) };
        const routerStub = {};
        const mockedActivated = {
            paramMap: of(
                convertToParamMap({
                    id: 'SSDDSDD55'
                })
            )
        };
        let mockStore: MockStore<any>;
        const initialState = {
            lead: fromStore.initialState
        };
        const mockDriver: Driver[] = [
            {
                driverID: 'SSDDSDD55',
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
        const navigationServiceStub = {
            upDateMarketingData: () => ({}),
            navigateSubRouteToSubRoute: () => ({})
        };
        const matDialogStub = {};
        const dataLayerServiceStub = {};
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [DriverMajorViolationsComponent],
            providers: [
              { provide: FormBuilder, useValue: formBuilder },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: mockedActivated },
                { provide: NavigationService, useValue: navigationServiceStub },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                provideMockStore({ initialState })
            ]
        });
        fixture = TestBed.createComponent(DriverMajorViolationsComponent);
        component = fixture.componentInstance;
        component.majorViolationsForm = formBuilder.group({
          majorViolations: ''
      });
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
            }
        });
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
            const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
            const navigationServiceStub: NavigationService = fixture.debugElement.injector.get(NavigationService);
            spyOn(formBuilderStub, 'group').and.callThrough();
            // spyOn(storeStub, 'select').and.callThrough();
            spyOn(navigationServiceStub, 'upDateMarketingData').and.callThrough();
            component.ngOnInit();
            expect(formBuilderStub.group).toHaveBeenCalled();
            // expect(storeStub.select).toHaveBeenCalled();
            expect(navigationServiceStub.upDateMarketingData).toHaveBeenCalled();
        });
    });
    describe('saveDetails', () => {
        it('makes expected calls', () => {
            const storeStub: Store<any> = fixture.debugElement.injector.get(Store);
            const navigationServiceStub: NavigationService = fixture.debugElement.injector.get(NavigationService);
          //  spyOn(storeStub, 'dispatch').and.callThrough();
            spyOn(navigationServiceStub, 'navigateSubRouteToSubRoute').and.callThrough();
            component.saveDetails();
            expect(navigationServiceStub.navigateSubRouteToSubRoute).toHaveBeenCalled();
        });
    });
});
