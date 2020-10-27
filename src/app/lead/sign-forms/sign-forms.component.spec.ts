import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from '@services/navigation.service';
import { SignFormsService } from '@services/sign-forms.service';
import { PdfGenerationModalComponent } from '@shared/pdf-generation-modal/pdf-generation-modal.component';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { SignFormsComponent } from './sign-forms.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SignFormsComponent', () => {
    let component: SignFormsComponent;
    let fixture: ComponentFixture<SignFormsComponent>;

    const docId = 'title=1000004011_PPAPA23FB_2019-09-09-132044';
    const docType = 'Policy';
    let mockStore: MockStore<any>;
    const initialState = {
        lead: {
            ...fromStore.initialState,
            quote: {
                signForms: []
            }
        },
        loader: { isLoading: true }
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

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    let deviceDetectorService, isDesktop, isTablet, isMobile;
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
    };
    const getPositionRes = {
        lat: '67567677678',
        long: '8987778778788',
        addr: { formatted_address: 'jhjhjhkhh' }
    };
    const mockSignfroms = {
        getPosition: jasmine.createSpy('getPosition').and.callFake(() => Promise.resolve(getPositionRes)),
        getIp: jasmine.createSpy('getIp').and.returnValue(of({ ip: '122.33.23.3' })),
        getSignFormBase64: jasmine.createSpy('getSignFormBase64').and.returnValue(
            of({
                file: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPU+c9QDwAENgGsqehIWwAAAABJRU5ErkJggg=='
            })
        )
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignFormsComponent],
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
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                DeviceDetectorService,
                { provide: SignFormsService, useValue: mockSignfroms },
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: NavigationService, useValue: mockNavigationService },
                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,

                quickQuote: {
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
                    signForms: [
                        {
                            description: 'string',
                            documentID: 'DFDSDFSE5',
                            formNumber: '12',
                            formStatus: 'string',
                            name: 'test'
                        },
                        {
                            description: 'string',
                            documentID: 'GGH66',
                            formNumber: '12',
                            formStatus: 'string',
                            name: 'test'
                        }
                    ]
                }
            },
            loader: { isLoading: true }
        });
        fixture = TestBed.createComponent(SignFormsComponent);
        component = fixture.componentInstance;
        deviceDetectorService = TestBed.get(DeviceDetectorService);
        isTablet = spyOn(deviceDetectorService, 'isTablet');
        isDesktop = spyOn(deviceDetectorService, 'isDesktop');
        isMobile = spyOn(deviceDetectorService, 'isMobile');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    xit('should have correct postion deatils and ip address ', () => {
        component.ngOnInit();
        expect(component.formattedAddress).toEqual(getPositionRes.addr.formatted_address);
        expect(component.latitude).toEqual(getPositionRes.lat);
        expect(component.longitude).toEqual(getPositionRes.long);
        expect(component.ipAddr).toEqual('122.33.23.3');
    });
    it('Ip address should undefined for get ip service failuer  ', () => {
        mockSignfroms.getIp.and.returnValue(throwError(''));
        component.ngOnInit();
        // expect(component.ipAddr).toEqual(undefined);
    });
    it('getPosition with access denaied ', () => {
        mockSignfroms.getPosition.and.callFake(() => Promise.reject({ error: 'error' }));
        component.ngOnInit();
        // expect(component.formattedAddress).toEqual('Location Access Denied');
    });
    it('getPosition with access denaied ', () => {
        component.saveDetails();
        expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('download Document  ', () => {
        component.openPDF(docId, docType);

        expect(mockSignfroms.getSignFormBase64).toHaveBeenCalled();
        const nodeElement = document.querySelectorAll('a[download]');
        expect(nodeElement[0]['download']).toEqual('Policy.pdf');
    });

    it('should show  PdfGenerationModalComponent for getSignFormBase64 service failuer   ', () => {
        mockSignfroms.getSignFormBase64.and.returnValue(throwError(''));
        component.fetchDoc(docId, docType);

        expect(mockSignfroms.getSignFormBase64).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(PdfGenerationModalComponent, {
            panelClass: 'pdf_generation_modal'
        });
    });

    xit('should be call toggle method', () => {
        component.toggle('1');
        const formValue = component.signFormGroup.controls['1'].value;
        expect(formValue).toBeTruthy(true);
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
