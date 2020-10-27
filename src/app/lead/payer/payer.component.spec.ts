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
import { NavigationService } from '@services/navigation.service';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { PayerComponent } from './payer.component';
import { TranslateModule } from '@ngx-translate/core';




describe('PayerComponent', () => {
    let component: PayerComponent;
    let fixture: ComponentFixture<PayerComponent>;

    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState, loader: { isLoading: false } };

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
    const mockNavgationService = {
        paymentCallBackCompleted: true,
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        registerBackHandler: jasmine.createSpy('registerBackHandler'),
        navigate: jasmine.createSpy('navigate')
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayerComponent],
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
                {
                    provide: PhoneFormatter,
                    useValue: {
                        removeUnimportantChars: jasmine.createSpy('removeUnimportantChars'),
                        format: jasmine.createSpy('format')
                    }
                },
                {
                    provide: NavigationService,
                    useValue: mockNavgationService
                },
                // PhoneFormatter,
                // EmailFormatter,
                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PayerComponent);
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
                    payerInfoAddress: {},
                    evoToken: { paymentToken: 'jhjhjhjhjj' },
                    updatePayerInfoAddress: false
                }
            }
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return correct form value ', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: mockDriver
                },
                quote: {
                    payerInfoAddress: {
                        firstName: 'firstName',
                        lastName: 'lastName',
                        primaryAddress: 'primaryAddress',
                        emailAddress1: 'email@Address1',
                        cellNumber: '76677767'
                    },
                    evoToken: { paymentToken: 'jhjhjhjhjj' },
                    updatePayerInfoAddress: 'Y'
                }
            }
        });
        component.ngOnInit();

        expect(component.form.value).toEqual({
            firstName: 'firstName',
            lastName: 'lastName',
            primaryAddress: 'primaryAddress',
            emailAddress1: 'email@Address1',
            cellNumber: undefined
        });
    });
    it('should retrun correct form control value', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: mockDriver
                },
                quote: {
                    payerInfoAddress: {
                        firstName: 'firstName',
                        lastName: 'lastName',
                        primaryAddress: 'primaryAddress',
                        emailAddress1: 'email@Address1',
                        cellNumber: '76677767'
                    },
                    evoToken: { paymentToken: 'jhjhjhjhjj' },
                    updatePayerInfoAddress: 'Y'
                }
            }
        });
        component.ngOnInit();
        component.form.patchValue({
            firstName: 'firstName',
            lastName: 'lastName',
            primaryAddress: 'primaryAddress',
            emailAddress1: 'email@Address1',
            cellNumber: '76677767'
        });
        const result = component.control('firstName');
        expect(result.value).toEqual('firstName');
    });
    it('should not show email error for vaild', () => {
        component.form.patchValue({
            firstName: 'firstName',
            lastName: 'lastName',
            primaryAddress: 'primaryAddress',
            emailAddress1: 'email@Address1',
            cellNumber: '76677767'
        });
        component.onEmailBlur();
        expect(component.showEmailError).toEqual(true);
    });
    it('should not phone email error for valid value', () => {
        component.form.patchValue({
            firstName: 'firstName',
            lastName: 'lastName',
            primaryAddress: 'primaryAddress',
            emailAddress1: 'email@Address1',
            cellNumber: '76677767'
        });
        component.onPhoneBlur();
        expect(component.showPhoneError).toEqual(true);
    });
    it('should hide payer form and call naviagtion method for "Y" value', () => {
        component.onButtonToggleClick('Y', true);
        expect(component.showPayerForm).toEqual(false);
        expect(mockNavgationService.navigate).toHaveBeenCalled();
    });
    it('should dispatch multiple actions with correct data', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: mockDriver
                },
                quote: {
                    payerInfoAddress: {
                        firstName: 'firstName',
                        lastName: 'lastName',
                        primaryAddress: {
                            addressLine1: 'string',
                            addressLine2: 'string',
                            city: 'string',
                            stateValue: 'string',
                            stateCode: 'string',
                            state: 'string',
                            postalCode: '15001',
                            country: 'string',
                            county: 'string',
                            addressType: 'string',
                            isAddressVerified: true,
                            manualAddress: true
                        },
                        emailAddress1: 'email@Address1',
                        cellNumber: '76677767'
                    },
                    evoToken: { paymentToken: 'jhjhjhjhjj' },
                    updatePayerInfoAddress: 'Y'
                }
            },
            loader: { isLoading: false }
        });
        const payerData = {
            firstName: 'firstName',
            lastName: 'lastName',
            emailAddress1: 'email@Address1',
            cellNumber: '76677767',
            primaryAddress: {
                addressLine1: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                postalCode: '15001',
                country: 'string',
                county: 'string',
                isAddressVerified: true,
                manualAddress: true
            }
        };
        const mockEvoToken = {
            returnURL: 'http://localhost:9876/car-insurance/#tokenconfirm&tokenconfirmed=true',
            cancelURL: 'http://localhost:9876/car-insurance/#payer'
        };
        component.ngOnInit();

        component['savePayerInfo']({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',

            state: 'string',
            postalCode: '15001',
            country: 'string',
            county: 'string',
            isAddressVerified: true,
            manualAddress: true
        });
        expect(mockStore.dispatch).toHaveBeenCalled();
        //    expect(mockStore.dispatch).toHaveBeenCalledWith(new LeadActions.SaveQuote(payerData),new LeadActions.SaveQuote(mockEvoToken));
        // expect(mockStore.dispatch).toHaveBeenCalledWith(new LeadActions.SaveQuote(mockEvoToken));
        // expect(mockStore.dispatch).toHaveBeenCalledWith(
        //     new LeadActions.UpdateAddressAction({
        //         lead: {
        //             quickQuote: {
        //                 vehicles: mockVehicle,
        //                 drivers: mockDriver
        //             },
        //             quote: {
        //                 payerInfoAddress: {
        //                     firstName: 'firstName',
        //                     lastName: 'lastName',
        //                     primaryAddress: {
        //                         addressLine1: 'string',
        //                         addressLine2: 'string',
        //                         city: 'string',
        //                         stateValue: 'string',
        //                         stateCode: 'string',
        //                         state: 'string',
        //                         postalCode: '15001',
        //                         country: 'string',
        //                         county: 'string',
        //                         addressType: 'string',
        //                         isAddressVerified: true,
        //                         manualAddress: true
        //                     },
        //                     emailAddress1: 'email@Address1',
        //                     cellNumber: '76677767'
        //                 },
        //                 evoToken: { paymentToken: 'jhjhjhjhjj' },
        //                 updatePayerInfoAddress: 'Y'
        //             }
        //         }
        //     })
        // );
    });
});
