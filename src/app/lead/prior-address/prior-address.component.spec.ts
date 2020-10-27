import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataLayerService } from '@services/data-layer.service';
import { GooglePredictionService } from '@services/google-prediction.service';
import { NavigationService } from '@services/navigation.service';
import { SplunkService } from '@services/splunk.service';
import { AddressInputComponent } from '@shared/address-input/address-input.component';
import { AutofillAddressComponent } from '@shared/autofill-address/autofill-address.component';
import { ManualAddressComponent } from '@shared/manual-address/manual-address.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { Address, Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { PriorAddressComponent } from './prior-address.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

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
const mockAddress: Address = {
    addressLine1: 'string',
    addressLine2: 'string',
    city: 'string',
    state: 'string',
    postalCode: 'string',
    county: 'string',
    country: 'string',
    manualAddress: true,
    isAddressVerified: true,
    isAutoComplete: true
};
const mockAddressPostalcodeEmpty: Address = {
    addressLine1: 'string',
    addressLine2: 'string',
    city: 'string',
    state: 'string',
    postalCode: '',
    county: 'string',
    country: 'string',
    manualAddress: true,
    isAddressVerified: true,
    isAutoComplete: true
};
describe('PriorAddressComponent', () => {
    let component: PriorAddressComponent;
    let fixture: ComponentFixture<PriorAddressComponent>;
    let mockStore: MockStore<any>, newComponent, mockDialog;
    const initialState = {
        lead: fromStore.initialState,
        loader: { isLoading: false }
    };
    const mockWindow = {
        dataLayer: []
    };
    const formBuilder: FormBuilder = new FormBuilder();
    const dataLayerServiceStub = { pushToDataLayer: jasmine.createSpy('pushToDataLayer') };
    const googlePredictionServiceStub = { seedLocationBias: jasmine.createSpy('seedLocationBias') };
    const navigationServiceStub = {
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        registerBackHandler: jasmine.createSpy('registerBackHandler'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        numOfTimesErrorOccurredOnScreen: {},
        navigate: jasmine.createSpy('navigate')
    };
    const splunkServiceStub = { log: jasmine.createSpy('log') };
    const addressPipeStub = { transform: jasmine.createSpy('transform') };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PriorAddressComponent,
                PageImageTitleComponent,
                AddressInputComponent,
                AutofillAddressComponent,
                ManualAddressComponent,
                TimeoutModalComponent
            ],
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
                AddressPipe,
                TranslateService,
                { provide: window, useValue: mockWindow },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                { provide: MatDialog, useValue: mockDialog },
                {
                    provide: GooglePredictionService,
                    useValue: googlePredictionServiceStub
                },
                { provide: SplunkService, useValue: splunkServiceStub },
                {
                    provide: NavigationService,
                    useValue: navigationServiceStub
                },
                provideMockStore({ initialState })
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(PriorAddressComponent);
        component = fixture.componentInstance;
        newComponent = component;
        component.form = new FormGroup({});
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
                    quoteNumber: '424234333',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                },
                primaryAddress: {
                    publicID: '5656565',
                    addressLine1: 'test address line',
                    addressLine2: 'test address line2',
                    cantFindAddress: false,
                    city: 'PA',
                    state: 'PA',
                    zipCode: '503224',
                    county: 'US',
                    country: 'US',
                    // timeAtCurrentResidenceExt: '',
                    timeAtCurrentResidenceCode: '0',
                    timeAtCurrentResidenceValue: '1',
                    isAddressVerified: false
                }
            },
            loader: { isLoading: false }
        });
        mockDialog = {
            open: jasmine.createSpy('open')
        };
        fixture.detectChanges();
    }));

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('isQuoteCreated defaults to: true', () => {
        expect(component.isQuoteCreated).toEqual(true);
    });
    it('should call toNextPage()', () => {
        spyOn(component, 'toNextPage').and.callThrough();
        component.toNextPage(mockAddress);
        expect(navigationServiceStub.saveLeadAndNavigate).toHaveBeenCalled();
    });
    it('should call mapPriorAddressToAddress ', () => {
        const priorAddrSpy = spyOn(newComponent, 'mapPriorAddressToAddress').and.returnValue(mockAddress);
        newComponent.mapPriorAddressToAddress(mockAddress);
        expect(priorAddrSpy()).toEqual(mockAddress);
    });
    it('should call toNextPage and postal code is empty', () => {
        spyOn(component, 'toNextPage').and.callThrough();
        component.toNextPage(mockAddressPostalcodeEmpty);
        expect(navigationServiceStub.saveLeadAndNavigate).toHaveBeenCalled();
    });
    it('should call showTimeoutOrNavigate and postal code is empty', () => {
        const error = { error: 'error' };
        spyOn(newComponent, 'showTimeoutOrNavigate').and.callThrough();
        newComponent.showTimeoutOrNavigate(error);
        expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalled();
    });
    it('should call showTimeoutOrNavigate and postal code is empty', () => {
        const error = { error: 'error' };
        navigationServiceStub.numOfTimesErrorOccurredOnScreen = 2;
        spyOn(newComponent, 'showTimeoutOrNavigate').and.callThrough();
        newComponent.showTimeoutOrNavigate(error);
        fixture.detectChanges();
        mockDialog.open(TimeoutModalComponent, {
            panelClass: 'custom-timeout-modal'
        });
        expect(mockDialog.open).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'custom-timeout-modal'
        });
    });
});
