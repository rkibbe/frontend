import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { ProductsListService } from '@app/core/services/products-list.service';
import { TrilliumAddressService } from '@app/core/services/trillium-address.service';
import { DataLayerService } from '@app/core/services/data-layer.service';
import { GooglePredictionService } from '@app/core/services/google-prediction.service';
import { NavigationService } from '@app/core/services/navigation.service';
import { SplunkService } from '@app/core/services/splunk.service';

import { VertiMaterialModule } from '@app/shared/verti-material.module';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { AddressPipe } from '@shared/pipes/address.pipe';
import { AddressComponent } from './address.component';
import { of, throwError } from 'rxjs';
import { LicenseStatus, TitleHolder, Vehicle, LicenseYears, Driver } from 'src/app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AddressInputComponent } from '@app/shared/address-input/address-input.component';
import { AutofillAddressComponent } from '@app/shared/autofill-address/autofill-address.component';
import { ManualAddressComponent } from '@app/shared/manual-address/manual-address.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Company, StateCode } from '@app/store/models/project.model';

describe('AddressComponent', () => {
    let component: AddressComponent;
    let fixture: ComponentFixture<AddressComponent>;
    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState,
        loader: { isLoading: false },
        project: {
            companyName: '',
            stateCode: ''
        }
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

    const address3 = {
        addressLine1: '810 Newtown Roa',
        city: 'Villanova',
        state: 'PA',
        postalCode: '19085-234',
        country: 'US',
        addressLine2: 'string',
        county: 'string'
    };
    const trilliumRespPartialAdd = {
        matchLevel: '0',
        dpvConfirm: 'Y',
        rdiFlag: 'Y',
        address: address3
    };
    const productsListServiceStub = {
        productListService: jasmine.createSpy('productListService').and.returnValue(of())
    };
    const trilliumAddressServiceStub = {
        verifyAddress: jasmine.createSpy('verifyAddress').and.returnValue(of())
    };
    const dataLayerServiceStub = { pushToDataLayer: jasmine.createSpy('pushToDataLayer') };
    const googlePredictionServiceStub = { seedLocationBias: jasmine.createSpy('seedLocationBias') };
    const navigationServiceStub = {
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        registerBackHandler: jasmine.createSpy('registerBackHandler'),
        numOfTimesErrorOccurredOnScreen: {},
        navigate: jasmine.createSpy('navigate'),
        currentRouteObj: {
            content: [
                {
                    attribute: 'address',
                    type: 'custom',
                    label: "I've lived here more than 2-months.",
                    placeHolder: '',
                    visible: true,
                    required: true,
                    hasDependency: false,
                    validations: [
                        {
                            name: 'required'
                        }
                    ]
                },
                {
                    attribute: 'timeAtCurrentResidenceCode',
                    type: 'text',
                    label: 'Length lived in current address',
                    placeHolder: '',
                    visible: true,
                    required: true,
                    hasDependency: false,
                    validations: [
                        {
                            name: 'required'
                        },
                        {
                            name: 'pattern',
                            pattern: '^[0-9]+$',
                            message: 'Accept only digits'
                        }
                    ]
                }
            ]
        }
    };
    let formGroup: FormGroup;
    const splunkServiceStub = { log: jasmine.createSpy('log') };
    const addressPipeStub = { transform: jasmine.createSpy('transform') };

    beforeEach(async(() => {
        formGroup = new FormGroup({
            timeAtCurrentResidenceCode: new FormControl(''),
            address: new FormControl('')
        });
        const matDialogStub = { open: (timeoutModalComponent, object) => ({}) };

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [AddressComponent, AddressInputComponent, AutofillAddressComponent, ManualAddressComponent],
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
                { provide: FormGroup, useValue: formGroup },
                AddressPipe,
                TranslateService,
                { provide: MatDialog, useValue: {} },
                { provide: ProductsListService, useValue: productsListServiceStub },
                {
                    provide: TrilliumAddressService,
                    useValue: trilliumAddressServiceStub
                },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                {
                    provide: GooglePredictionService,
                    useValue: googlePredictionServiceStub
                },
                { provide: SplunkService, useValue: splunkServiceStub },
                { provide: NavigationService, useValue: navigationServiceStub },
                provideMockStore({ initialState })
            ]
        });
        fixture = TestBed.createComponent(AddressComponent);

        component = fixture.componentInstance;
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
            loader: { isLoading: false },
            project: {
                companyName: Company.MAPFRE,
                stateCode: StateCode.MA
            }
        });
        component.ngOnInit();
        fixture.detectChanges();
    }));
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    it('isQuoteCreated defaults to: true', () => {
        expect(component.isQuoteCreated).toEqual(true);
    });
    it('residenceControl value should change for verti ', () => {
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
            loader: { isLoading: false },
            project: {
                companyName: Company.VERTI,
                stateCode: StateCode.PA
            }
        });
        component.ngOnInit();
        console.log('>>>>>>>>????????????????', this.residenceControl);
    });

    describe('savePNIData', () => {
        it('savePNIData', () => {
            // component.residenceControl.setValue(false);
            component.savePNIData({
                addressLine1: 'test address line',
                addressLine2: 'test address line2',
                city: 'PA',
                state: 'PA',
                county: 'US',
                country: 'US',
                postalCode: '503224'
            });
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(dataLayerServiceStub.pushToDataLayer).toHaveBeenCalled();
        });
        it('mapAddressToPrimaryAddress', () => {
            const result = component['mapAddressToPrimaryAddress'](
                {
                    addressLine1: 'test address line',
                    addressLine2: 'test address line2',
                    city: 'PA',
                    state: 'PA',
                    county: 'US',
                    country: 'US',
                    postalCode: '503224'
                },
                false
            );
            expect(+result.timeAtCurrentResidenceCode).toEqual(0);
            expect(+result.timeAtCurrentResidenceValue).toEqual(0);
        });
    });

    describe('saveDetails', () => {
        it('should excute error balck ', () => {
            productsListServiceStub.productListService.and.returnValue(of(''));
            trilliumAddressServiceStub.verifyAddress.and.returnValue(of({}));
            component.saveDetails();
            expect(mockStore.dispatch).toHaveBeenCalled();
        });
        it('should call naviagte method if productList and verifyAddress service success', () => {
            productsListServiceStub.productListService.and.returnValue(of('Product Found'));
            trilliumAddressServiceStub.verifyAddress.and.returnValue(of(trilliumRespPartialAdd));
            component.isQuoteCreated = false;
            component.saveDetails();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(navigationServiceStub.navigate).toHaveBeenCalled();
        });
        it('should call gotoRouteByName method for "product not found" response in productList service ', () => {
            productsListServiceStub.productListService.and.returnValue(of('Product Not Found'));
            trilliumAddressServiceStub.verifyAddress.and.returnValue(throwError(''));
            component.isQuoteCreated = false;
            component.saveDetails();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalled();
            expect(navigationServiceStub.gotoRouteByName).toHaveBeenCalledWith('notinyourarea');
        });
        it('should call navigate method for other response in productList service ', () => {
            productsListServiceStub.productListService.and.returnValue(of('other response '));
            trilliumAddressServiceStub.verifyAddress.and.returnValue(throwError(''));
            component.isQuoteCreated = false;
            component.saveDetails();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(navigationServiceStub.navigate).toHaveBeenCalled();
        });
        it('should isQuoteCreated value is false if quoteNumber not found in store ', fakeAsync(() => {
            mockStore.setState({
                lead: {
                    ...initialState,
                    marketingData: { campaignID: '534353534', zipCode: '503224' },
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
                        isAddressVerified: false,
                        isAutoComplete: false
                    }
                },
                loader: { isLoading: false },
                project: {
                    companyName: Company.MAPFRE,
                    stateCode: StateCode.MA
                }
            });

            component.ngOnInit();
            tick(100);
            expect(component.isQuoteCreated).toEqual(false);
            expect(googlePredictionServiceStub.seedLocationBias).toHaveBeenCalled();
            expect(googlePredictionServiceStub.seedLocationBias).toHaveBeenCalledWith('503224');
        }));
    });
    describe('saveLeadAndNavigate', () => {
        it('should call naviagte method', () => {
            component.saveLeadAndNavigate();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(navigationServiceStub.navigate).toHaveBeenCalled();
        });
    });
});
