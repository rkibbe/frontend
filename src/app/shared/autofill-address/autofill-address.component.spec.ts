import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutofillAddressComponent } from './autofill-address.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { VertiMaterialModule } from '../verti-material.module';
import { SharedModule } from '../shared.module';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManualAddressComponent } from '../manual-address/manual-address.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { AddressPipe } from '../pipes/address.pipe';
import { Store, StoreModule } from '@ngrx/store';
import { Router, RouterEvent } from '@angular/router';
import * as fromStore from '../../store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of } from 'rxjs';
import { TitleHolder, Vehicle, LicenseStatus, LicenseYears, Driver } from 'src/app/store/models/lead.model';
import { GoogleAddressPrediction, GooglePredictionService } from '@services/google-prediction.service';

describe('AutofillAddressComponent', () => {
    let component: AutofillAddressComponent;
    let fixture: ComponentFixture<AutofillAddressComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const eventSubject = new ReplaySubject<RouterEvent>(1);
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
    const mockGooglePredAddr: GoogleAddressPrediction = {
        placeId: '323213',
        formattedAddress: 'northen Usa',
        mainText: 'test ',
        secondaryText: 'string',
        matchedSubstrings: [{ length: 2, offset: 2 }],
        terms: [{ offset: 4, value: 'string' }]
    };
    const mockService = {
        getAddressDetails: jasmine.createSpy('getAddressDetails').and.returnValue(
            of({
                addressLine1: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                postalCode: '15001'
            })
        ),
        getGooglePlacePredictions: jasmine.createSpy('getGooglePlacePredictions').and.returnValue(
            of({
                addressLine1: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                postalCode: '15001'
            })
        )
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AutofillAddressComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                CoreModule,
                VertiMaterialModule,
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule,
                StoreModule.forRoot({})
            ],
            providers: [
                HttpClient,
                HttpHandler,
                AddressPipe,
                provideMockStore({ initialState }),
                {
                    provide: Router,
                    useValue: {
                        events: eventSubject.asObservable(),
                        url: 'test/url',
                        navigate: jasmine.createSpy('navigate')
                    }
                },
                {
                    provide: GooglePredictionService,
                    useValue: mockService
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AutofillAddressComponent);
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
                }
            }
        });
        component.allowPOBox = false;
        component.addressLine2 = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change addressControl value to googlepreduction', () => {
        component.form.patchValue({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: '15001'
        });
        const spy = spyOn(component.changeToManualAddress, 'emit');
        component['addressControl'].setValue(mockGooglePredAddr);
        expect(mockService.getAddressDetails).toHaveBeenCalled();
    });
    xit('should change addressControl value', () => {
        component.form.patchValue({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: '15001'
        });
        component['addressControl'].setValue(0);
    });
    xit('should fire change method addressControl string value ', () => {
        component.form.patchValue({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: '15001'
        });
        component['addressControl'].setValue('');
    });
    xit('should return null if form vaild for validate method ', () => {
        component.form.patchValue({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: '15001'
        });
        const result = component.validate();
        expect(result).toEqual(null);
    });
    it('should return { address: true } if form invaild for validate method ', () => {
        component.form.patchValue({});
        const result = component.validate();
        expect(result).toEqual({ address: true });
    });
    it('should set correct addressLine2Control value', () => {
        component.writeValue({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: '15001'
        });
        expect(component['addressLine2Control'].value).toEqual('string');
    });
    it('should set as empty addressLine2Control value if addressLine2 has no value ', () => {
        component.writeValue({
            addressLine1: '',
            addressLine2: '',
            city: 'string',
            state: 'string',
            postalCode: '15001'
        });
        expect(component['addressLine2Control'].value).toEqual('');
    });
    it('should set as empty addressLine2Control value if dont have any value  ', () => {
        component.writeValue({
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: ''
        });
        expect(component['addressLine2Control'].value).toEqual('');
        expect(component['addressControl'].value).toEqual(null);
    });
    it('should set as empty addressLine2Control value if dont have any value  ', () => {
        component.writeValue('');
        expect(component['addressLine2Control'].value).toEqual('');
        expect(component['addressControl'].value).toEqual(null);
    });
});
