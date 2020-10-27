import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, convertToParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';
import { DriverLicenseStatusComponent } from './driver-license-status.component';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TitleHolder, Driver, LicenseYears, LicenseStatus, Vehicle } from '@app/store/models/lead.model';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
describe('DriverLicenseStatusComponent', () => {
    let component: DriverLicenseStatusComponent;
    let fixture: ComponentFixture<DriverLicenseStatusComponent>;
    const mockActivated = {
        paramMap: of(convertToParamMap({ id: '00Q2900066007WiX0EAK-1', jobId: '7788787' })),
        snapshot: {
            queryParams: {
                replaceCard: true,
                frmActSt: true
            }
        }
    };
    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
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
    const formBuilder: FormBuilder = new FormBuilder();

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
    beforeEach(() => {
        const formBuilderStub = { group: object => ({}) };
        const routerStub = { navigate: (array, object) => ({}) };
        const activatedRouteStub = { paramMap: { subscribe: () => ({}) } };
        
        const navigationServiceStub = {
            upDateMarketingData: () => ({}),
            navigateSubRouteToSubRoute: () => ({})
        };
        const matDialogStub = { open: (errorDialogModalComponent, object) => ({}) };
        const dataLayerServiceStub = {};
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [DriverLicenseStatusComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: Router, useValue: routerStub },
                // { provide: ActivatedRoute, useValue: activatedRouteStub },
                // { provide: Store, useValue: storeStub },
                { provide: NavigationService, useValue: navigationServiceStub },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivated
                },
                provideMockStore({ initialState })
            ],
            imports:[TranslateModule.forRoot()]
        });
        fixture = TestBed.createComponent(DriverLicenseStatusComponent);
        component = fixture.componentInstance;
        component.licenseStatusForm = formBuilder.group({
            licenseRevoked: ''
        });
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
                    evoToken: { paymentToken: 'jhjhjhjhjj' },
                },
                error:{

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
            const navigationServiceStub: NavigationService = fixture.debugElement.injector.get(NavigationService);
            spyOn(formBuilderStub, 'group').and.callThrough();
            spyOn(navigationServiceStub, 'upDateMarketingData').and.callThrough();
            component.ngOnInit();
            expect(formBuilderStub.group).toHaveBeenCalled();
            expect(navigationServiceStub.upDateMarketingData).toHaveBeenCalled();
        });
    });
    describe('navigateToNextPage', () => {
        it('makes expected calls', () => {
            component.errorOccured= false;
            const routerStub: Router = fixture.debugElement.injector.get(Router);
            const matDialogStub: MatDialog = fixture.debugElement.injector.get(MatDialog);
            spyOn(routerStub, 'navigate').and.callThrough();
            spyOn(matDialogStub, 'open').and.callThrough();
            component.navigateToNextPage();
          //  expect(routerStub.navigate).toHaveBeenCalled();
            // expect(mockStore.select).toHaveBeenCalled();
           // expect(matDialogStub.open).toHaveBeenCalled();
        });
    });
    describe('saveDetails', () => {
        it('makes expected calls', () => {
            component.ngOnInit();
            // component.licenseStatusForm.setValue({
            //     isPNI: true,
            //     isIncluded: true,
            //     licenseStatus: LicenseStatus.ValidLicense
            // });
            const navigationServiceStub: NavigationService = fixture.debugElement.injector.get(NavigationService);
            spyOn(navigationServiceStub, 'navigateSubRouteToSubRoute').and.callThrough();
            component.saveDetails();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(navigationServiceStub.navigateSubRouteToSubRoute).toHaveBeenCalled();
        });
    });
});
