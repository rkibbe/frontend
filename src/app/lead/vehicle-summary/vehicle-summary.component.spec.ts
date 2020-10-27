import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppSettingsService } from '@services/app-settings.service';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { ImageDescriptionGroupComponent } from '@shared/image-description-group/image-description-group.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { AppSettings } from '@shared/settings/app-settings';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { VehicleSummaryComponent } from './vehicle-summary.component';
import { TranslateModule } from '@ngx-translate/core';




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
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108615',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108615',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
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
    },
    {
        // vehicleId = leadId-1
        vehicleID: 'SSDDSDD55',
        publicId: 'string',
        year: '1998',
        make: '2008',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108619',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108619',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
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
const mockSingleVehicle: Vehicle[] = [
    {
        // vehicleId = leadId-1
        vehicleID: 'SSDDSDD55',
        publicId: 'string',
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108615',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108615',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
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
const isIncludedFalseVehicle = [
    {
        vehicleID: 'SSDDSDD55',
        publicId: 'string',
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108615',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108615',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
        stubbedVIN: 'string',
        isIncluded: false
    }
];
const moreVehicles = [
    {
        vehicleID: 'SSDDSDD55',
        publicId: 'string',
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108611',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108611',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
        stubbedVIN: 'string',
        isIncluded: true
    },
    {
        vehicleID: 'SSDDSDD56',
        publicId: 'string',
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108616',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108616',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
        stubbedVIN: 'string',
        isIncluded: true
    },
    {
        vehicleID: 'SSDDSDD57',
        publicId: 'string',
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108617',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108617',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
        stubbedVIN: 'string',
        isIncluded: true
    },
    {
        vehicleID: 'SSDDSDD58',
        publicId: 'string',
        year: '1999',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: '2S3DB217876108618',
        bodyStyle: 'SP',
        vinPrefix: '2S3DB217876108618',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'CG',
        stubbedVIN: 'string',
        isIncluded: true
    }
];

describe('VehicleSummaryComponent', () => {
    let component: VehicleSummaryComponent;
    let fixture: ComponentFixture<VehicleSummaryComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const settings = new AppSettings();
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        navigateToSubRoute: jasmine.createSpy('navigateToSubRoute'),
        policyNumber: '3423423'
    };
    const mockAappSettingsService = {
        getSettings: jasmine.createSpy('getSettings').and.returnValue(of(settings))
    };
    const mockDatalayerService = {
        pushToDataLayer: jasmine.createSpy('pushToDataLayer').and.returnValue(of())
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VehicleSummaryComponent, ImageDescriptionGroupComponent, PageImageTitleComponent],
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
                { provide: NavigationService, useValue: mockNavigationService },
                { provide: DataLayerService, useValue: mockDatalayerService },
                provideMockStore({ initialState }),
                { provide: AppSettingsService, useValue: mockAappSettingsService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VehicleSummaryComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: {
                    campaignID: '534353534',
                    leadSource: 'string',
                    currentURL: 'string',
                    referringURL: 'string',
                    mbsy: 'string',
                    zipCode: '44554'
                },
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
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                }
            }
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call pushToDataLayer on click of saveToDataLayer with  multi product is no', () => {
        component.filterVehicles(mockSingleVehicle);
        component.saveToDataLayer();
        expect(mockDatalayerService.pushToDataLayer).toHaveBeenCalled();
        expect(mockDatalayerService.pushToDataLayer).toHaveBeenCalledWith({
            model: 'CHAVROLET',
            make: '2009',
            multi_product: 'no'
        });
    });
    it('should call isClickable on click of saveDetails', () => {
        component.isClickable(isIncludedFalseVehicle);
        expect(component.maxVehicleLimit).toEqual(false);
    });
    it('should call pushToDataLayer on click of saveToDataLayer with multi product is yes', () => {
        component.saveToDataLayer();
        expect(mockDatalayerService.pushToDataLayer).toHaveBeenCalled();
        expect(mockDatalayerService.pushToDataLayer).toHaveBeenCalledWith({
            model: 'CHAVROLET',
            make: '2009',
            multi_product: 'yes'
        });
    });
    it('should call saveLeadAndNavigate on click of saveDetails', () => {
        component.saveDetails();
        expect(mockNavigationService.saveLeadAndNavigate).toHaveBeenCalled();
    });
    it('should call filterVehicles and return cirrect value ', () => {
        component.filterVehicles(mockVehicle);
        expect(component.vehicleData[0].iconExisted).toEqual(true);
    });
    it('should call navigateToSubRoute on click of edit', () => {
        const event = {
            type: 'click',
            stopPropagation: function() {}
        };
        component.edit(mockVehicle[0].vehicleID, event);
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalled();
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalledWith(mockVehicle[0].vehicleID);
    });
    it('should return correct split public id on splitPublicId', () => {
        const result = component.splitPublicId('pc:447252');
        expect(result).toEqual('447252');
    });
    it('should dispatch UpdateVehicle action with isIncluded true on click of addThisVehicle', () => {
        component.addThisVehicle(mockVehicle[0]);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateVehicle({
                vehicleID: mockVehicle[0].vehicleID,
                isIncluded: true,
                isQuoteVehicle: true
            })
        );
    });
    it('should dispatch AddVehicle action with isIncluded true on click of addNewVehicle', () => {
        component.leadID = '3232323';
        component.numberOfVehicles = 3;
        component.addNewVehicle();
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.AddVehicle({
                vehicleID: '3232323-4',
                isIncluded: false,
                isADPF: false,
                isQuoteVehicle: false,
                isAlreadyIncluded: false
            })
        );
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalled();
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalledWith(mockVehicle[0].vehicleID);
    });
    it('should dispatch UpdateVehicle action with isIncluded false on click of removeVehicle', () => {
        component.remove(mockVehicle[0].vehicleID);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateVehicle({
                vehicleID: mockVehicle[0].vehicleID,
                isIncluded: false,
                isQuoteVehicle: false
            })
        );
    });
    it('should dispatch UpdateVehicle action with isIncluded true on click of addThisVehicle', () => {
        const vehicle = {
            stubbedVIN: true,
            vehicleID: 'SSDDSDD55',
            isIncluded: true
        };
        component.handleClick(vehicle);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateVehicle({
                vehicleID: mockVehicle[0].vehicleID,
                isIncluded: false,
                isQuoteVehicle: false
            })
        );
    });
    it('should dispatch UpdateVehicle action with isIncluded false on click of removeVehicle', () => {
        const vehicle = {
            stubbedVIN: true,
            vehicleID: 'SSDDSDD55',
            isIncluded: false
        };
        component.handleClick(vehicle);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateVehicle({
                vehicleID: mockVehicle[0].vehicleID,
                isIncluded: true,
                isQuoteVehicle: true
            })
        );
    });
    it('should call navigateToSubRoute on click of edit', () => {
        component.handleClick(mockVehicle[0].vehicleID);
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalled();
        expect(mockNavigationService.navigateToSubRoute).toHaveBeenCalledWith(mockVehicle[0].vehicleID);
    });
    it('should have disabledNextBtn is true and isInclude is false', () => {
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: {
                    campaignID: '534353534',
                    leadSource: 'string',
                    currentURL: 'string',
                    referringURL: 'string',
                    mbsy: 'string',
                    zipCode: '44554'
                },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: isIncludedFalseVehicle,
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
            }
        });
        fixture.detectChanges();
        expect(component.disabledNextBtn).toEqual(true);
    });
    it('should have vehicles count is 4 and maxVehicleLimit is true', () => {
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: {
                    campaignID: '534353534',
                    leadSource: 'string',
                    currentURL: 'string',
                    referringURL: 'string',
                    mbsy: 'string',
                    zipCode: '44554'
                },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: moreVehicles,
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
            }
        });
        fixture.detectChanges();
        expect(component.maxVehicleLimit).toEqual(true);
    });
    it('should have vehicles count is 4 and maxVehicleLimit is true', () => {
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: {
                    currentURL: 'https://konydev02.mapfreinsurance.com/car-insurance/#homeaddress',
                    leadID: '00Q29000007fq2tEAA',
                    leadSource: 'Fusion',
                    mbsy: null,
                    referringURL: null,
                    zipCode: null
                },
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
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                }
            }
        });
        fixture = TestBed.createComponent(VehicleSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.filterVehicles(mockVehicle);
        expect(component.vehicleData[0].iconExisted).toEqual(true);
        expect(component.marketingData.leadSource).toEqual('Fusion');
    });
});
