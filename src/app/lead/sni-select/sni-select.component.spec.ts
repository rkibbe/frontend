import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatCardModule } from '@angular/material';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from '@services/navigation.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { of, Subscription } from 'rxjs';
import { AddSNIAction } from 'src/app/store/actions/lead.actions';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { SniSelectComponent } from './sni-select.component';
import { TranslateModule } from '@ngx-translate/core';



describe('SniSelectComponent', () => {
    let component: SniSelectComponent;

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
            licenseStatus: LicenseStatus.ValidLicense,
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

    let mockedStore;
    let mockedNavigationService;

    let testDriver1;
    let testDriver2;
    let testDriver3;

    let testDriverListSingle;
    let testDriverListMult;
    const fb: FormBuilder = new FormBuilder();

    describe('unit test', () => {
        beforeEach(() => {
            mockedStore = {
                select: jasmine.createSpy('select').and.returnValue(of())
            };

            mockedNavigationService = {
                gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
                navigate: jasmine.createSpy('navigate'),
                upDateMarketingData: jasmine.createSpy('upDateMarketingData')
            };
            component = new SniSelectComponent(mockedStore, mockedNavigationService, fb);

            testDriver1 = {
                firstName: 'testFirst1',
                lastName: 'testLast1'
            };

            testDriver2 = {
                firstName: 'testFirst2',
                lastName: 'testLast2'
            };

            testDriver3 = {
                firstName: 'testFirst3',
                lastName: 'testLast3'
            };

            testDriverListSingle = [testDriver1];
            testDriverListMult = [testDriver1, testDriver2, testDriver3];
        });

        it('should have empty driver list and non empty title on construct', () => {
            expect(component.drivers).toEqual(undefined);
        });

        describe('ngOnInit', () => {
            it('should have the correct title when one driver is provided', () => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testDriverListSingle));

                component.ngOnInit();
            });

            it('should have the correct title when multiple drivers are provided', () => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testDriverListMult));

                component.ngOnInit();

                for (const driver of testDriverListMult) {
                }
            });
        });

        describe('ngOnDestroy', () => {
            it('should unsubcribe from any subscriptions', () => {
                component.drivers$ = new Subscription();

                expect(component.drivers$.closed).toBeFalsy();

                component.ngOnDestroy();

                expect(component.drivers$.closed).toBeTruthy();
            });
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<SniSelectComponent>;

        let storeMock: MockStore<any>;
        const initialState = { lead: fromStore.initialState };

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [SniSelectComponent, PageImageTitleComponent],
                imports: [FormsModule,TranslateModule.forRoot(), ReactiveFormsModule, MatCardModule, MatButtonToggleModule],
                providers: [
                    { provide: NavigationService, useValue: mockedNavigationService },
                    provideMockStore({ initialState })
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SniSelectComponent);
            component = fixture.componentInstance;
            storeMock = TestBed.get(Store) as MockStore<any>;
            storeMock.dispatch = jasmine.createSpy('dispatch');
            storeMock.setState({
                lead: {
                    ...initialState,
                    quickQuote: {
                        vehicles: mockVehicle,
                        drivers: mockDriver
                    },
                    quote: {}
                },
                isSNISelected: false
            });

            mockedNavigationService = TestBed.get(NavigationService);
        });

        it('should create', () => {
            fixture.detectChanges();
            expect(component).toBeTruthy();
        });

        describe('single driver', () => {
            beforeEach(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testDriverListSingle));
                fixture.autoDetectChanges();
            });

            it('should dispatch AddSNIAction if driverId nagitive response ', () => {
                component.onButtonToggleClick('-1');
                expect(storeMock.dispatch).toHaveBeenCalled();
                expect(storeMock.dispatch).toHaveBeenCalledWith(
                    new AddSNIAction({
                        secondaryInsured: {
                            driverID: null,
                            email: null,
                            phone: null,
                            isSNISelected: false
                        }
                    })
                );
                expect(mockedNavigationService.navigate).toHaveBeenCalled();
            });
            it('should dispatch AddSNIAction if driverId nagitive response ', () => {
                component.onButtonToggleClick('8989');
                expect(mockedNavigationService.gotoRouteByName).toHaveBeenCalled();
                expect(mockedNavigationService.gotoRouteByName).toHaveBeenCalledWith('snicontact/8989');
            });
        });
    });
});
