import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from '@services/navigation.service';
import { SplunkService } from '@services/splunk.service';
import { VehicleAddService } from '@services/vehicle-add-service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { VehicleComponent } from './vehicle.component';
import { TranslateModule } from '@ngx-translate/core';



describe('QuickquoteComponent', () => {
    let component: VehicleComponent;
    let fixture: ComponentFixture<VehicleComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const mockedActivated = {
        paramMap: of(
            convertToParamMap({
                id: 'SSDDSDD55'
            })
        )
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
    const mockMakelist = [
        {
            code: '322',
            description: '2009'
        }
    ];
    const mockModallist = [
        {
            code: '322',
            description: 'CHAVROLET'
        }
    ];
    const mockTrimist = [
        {
            code: '322',
            description: 'TRIM'
        }
    ];
    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
    };
    const mockVehicleAddService = {
        getVehicleYear: jasmine.createSpy('getVehicleYear').and.returnValue(of(mockMakelist)),
        getVehicleMake: jasmine.createSpy('getVehicleMake').and.returnValue(of(mockMakelist)),
        getVehicleModel: jasmine.createSpy('getVehicleModel').and.returnValue(of(mockModallist)),
        getVehicleTrim: jasmine.createSpy('getVehicleTrim').and.returnValue(of(mockTrimist))
    };
    const plickService = {
        log: jasmine.createSpy('log')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VehicleComponent, PageImageTitleComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot({}),
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: ActivatedRoute, useValue: mockedActivated },
                { provide: NavigationService, useValue: mockNavigationService },
                { provide: VehicleAddService, useValue: mockVehicleAddService },
                { provide: SplunkService, useValue: plickService },
                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VehicleComponent);
        component = fixture.componentInstance;
        const SpyObj = jasmine.createSpyObj({
            afterClosed: of(''),
            close: null
        });
        mockMatDialog.open.and.returnValue(SpyObj);
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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('SHOULD HAVE CORRECT SELECTED VEHICLE', () => {
        component.ngOnInit();
        expect(component['vehicleId']).toBe('SSDDSDD55');
    });
    it('should dispatch LeadActions.AddVehicle action  on click of addAnotherVehicle', () => {
        component['leadID'] = '21332';
        component.addAnotherVehicle();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.AddVehicle({
                vehicleID: '21332-2',
                isIncluded: false,
                isADPF: false,
                isQuoteVehicle: false
            })
        );
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('vehicleadd/21332-2');
    });
    it('should call gotoRuotename method on click of saveDeatils with vehiclesummary', () => {
        component.saveDetails();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('vehiclesummary');
    });
    it('should show time out modal for getVehicleYear error response ', () => {
        mockVehicleAddService.getVehicleYear.and.returnValue(throwError(''));
        component['getVehicleYear']();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'custom-timeout-modal'
        });
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith('vehiclesummary');
    });
    it('should call gotoRuotename method on click of saveDeatils with vehiclesummary', () => {
        mockVehicleAddService.getVehicleMake.and.returnValue(of([]));
        component.ngOnInit();
        expect(component.vehiclesTotal[component['carsAdded']]).toEqual([{ code: 'string', description: 'string' }]);
    });
    it('should call gotoRuotename method on click of saveDeatils with vehiclesummary', () => {
        mockVehicleAddService.getVehicleMake.and.returnValue(of(mockMakelist));
        mockVehicleAddService.getVehicleModel.and.returnValue(of([]));
        component.ngOnInit();
        expect(component.vehiclesTotal[component['carsAdded']]).toEqual([
            { code: 'string', description: 'string' },
            { code: '322', description: '2009' }
        ]);
    });
    it('should call gotoRuotename method on click of saveDeatils with vehiclesummary', () => {
        mockVehicleAddService.getVehicleMake.and.returnValue(of(mockMakelist));
        mockVehicleAddService.getVehicleModel.and.returnValue(of(mockModallist));
        mockVehicleAddService.getVehicleTrim.and.returnValue(of([]));
        component.ngOnInit();
        expect(component.vehiclesTotal[component['carsAdded']]).toEqual([
            { code: 'string', description: 'string' },
            { code: '322', description: '2009' },
            { code: '322', description: 'CHAVROLET' }
        ]);
    });
    it('should call gotoRuotename method on click of saveDeatils with vehiclesummary', () => {
        mockVehicleAddService.getVehicleMake.and.returnValue(of(throwError('')));
        // component.ngOnInit();
        component.save({ code: '3131', description: 'CHAVROLET' });
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateVehicle({
                vehicleID: 'SSDDSDD55',
                isIncluded: true,
                isADPF: false,
                isAlreadyIncluded: true,
                isQuoteVehicle: true,
                isVisible: true,
                year: 'string',
                make: '2009',
                model: 'CHAVROLET',
                trim: 'CHAVROLET',
                bodyStyleCode: '',
                bodyStyle: '',
                stubbedVIN: '',
                vinPrefix: '',
                isStubbedVin: false,
                vin: ''
            })
        );
    });
});
