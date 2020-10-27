import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSavingModalComponent } from './discount-saving-modal.component';
import { MatDialogRef, MatDialog } from '@angular/material';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { TypeListService } from '@services/type-list.service';
import { NavigationService } from '@services/navigation.service';

import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BigPriceComponent } from '../big-price/big-price.component';
import { of } from 'rxjs';
import { TitleHolder, Vehicle, LicenseYears, LicenseStatus, Driver } from 'src/app/store/models/lead.model';
import { WalmericDialogModalComponent } from 'src/app/core/walmeric-dialog-modal/walmeric-dialog-modal.component';

describe('DiscountSavingModalComponent', () => {
    let component: DiscountSavingModalComponent;
    let fixture: ComponentFixture<DiscountSavingModalComponent>;

    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockMatDialogRef = {
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiscountSavingModalComponent, BigPriceComponent],
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
                HttpClientModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                {
                    provide: TypeListService,
                    useValue: {
                        getDiscountTypes: jasmine.createSpy('getDiscountTypes').and.returnValue(
                            of([
                                {
                                    code: 'advancedShoppingCredit',
                                    description: 'Advance Shopping Credit'
                                },
                                {
                                    code: 'afterMarketDeviceDiscount',
                                    description: 'AfterMarket Device Discount'
                                }
                            ])
                        )
                    }
                },
                { provide: MatDialog, useValue: mockMatDialog },
                NavigationService,
                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscountSavingModalComponent);
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
                    discounts: [],
                    savings: ''
                }
            }
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close dailog on click of close ', () => {
        component.close();
        expect(mockMatDialogRef.close).toHaveBeenCalled();
    });
    it('should open WalmericDialogModalComponent on click of openWalmaric ', () => {
        component.openWalmaric();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    });
});
