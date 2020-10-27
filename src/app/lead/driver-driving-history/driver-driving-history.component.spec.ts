import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';
import { DriverDrivingHistoryComponent } from './driver-driving-history.component';
import { LicenseStatus, TitleHolder, Vehicle } from '@app/store/models/lead.model';
import { of } from 'rxjs';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('DriverDrivingHistoryComponent', () => {
    let component: DriverDrivingHistoryComponent;
    let fixture: ComponentFixture<DriverDrivingHistoryComponent>;
    beforeEach(() => {
        const mockActivated = {
            paramMap: of(convertToParamMap({ id: '12356', jobId: '7788787' })),
            snapshot: {
                queryParams: {
                    replaceCard: true,
                    frmActSt: true
                }
            }
        };
        const formBuilder: FormBuilder = new FormBuilder();
        let store: MockStore<any>;
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
        const initialState = { lead: fromStore.initialState };
        const mockData = {
            leadLandingScreen: 'drivinghistory',
            marketingData: { campaignID: '534353534' },
            enterprisePartyID: '5534353443',
            quickQuote: {
                monthlyPremiumPrice: '767',
                drivers: [
                    {
                        isPNI: true,
                        isIncluded: true,
                        licenseStatus: LicenseStatus.ValidLicense
                    }
                ],
                vehicles: [
                    {
                        isIncluded: false,
                        isADPF: true
                    }
                ]
            },
            quote: {
                quoteNumber: '424234333',
                mailingAddress: {
                    addressLine1: 'string',
                    addressLine2: 'string',
                    city: 'string',
                    state: 'string',
                    postalCode: 'string',
                    county: 'string',
                    country: 'string'
                }
            },
            firstName: 'test name',
            monthlyPremiumPrice: '4343',
            primaryEmailAddress: 'test@email.com',
            primaryAddress: {
                publicId: 'string',
                displayName: 'string',
                addressLine1: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                postalCode: 'string',
                county: 'string',
                country: 'string',
                timeAtCurrentResidenceCode: 'string',
                timeAtCurrentResidenceValue: 'string',
                isAddressVerified: true,
                cantFindAddress: true,
                isAutoComplete: true
            }
        };
        const navigationServiceStub = {
            upDateMarketingData: () => ({}),
            navigateSubRouteToSubRoute: () => ({})
        };
        const matDialogStub = {};
        const dataLayerServiceStub = {};
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [DriverDrivingHistoryComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                // { provide: ActivatedRoute, useValue: activatedRouteStub },
                // { provide: Store, useValue: storeMock },
                provideMockStore({ initialState }),

                {
                    provide: ActivatedRoute,
                    useValue: mockActivated
                },
                { provide: NavigationService, useValue: navigationServiceStub },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: DataLayerService, useValue: dataLayerServiceStub }
            ]
        });
        fixture = TestBed.createComponent(DriverDrivingHistoryComponent);
        component = fixture.componentInstance;
        component.driverMinorViolation = formBuilder.group({
            noOfAtFaultAccidents: 'none',
            noOfComprehensiveClaims: 'none',
            noOfMovingViolations: 'none',
            noOfNotAtFaultAccidents: 'none'
        });
        store = TestBed.get(Store) as MockStore<any>;
        store.dispatch = jasmine.createSpy('dispatch');
        store.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: [
                        {
                            firstName: 'Sdffs',
                            lastName: 'Dfsdfs',
                            genderCode: 'M',
                            roleCode: '',
                            roleVaue: '',
                            driverID: '12356',
                            genderValue: 'string',
                            age: 'string',
                            isIncluded: 'boolean',
                            noOfAccidentsAndViolations: true
                        }
                    ]
                },
                quote: {
                    isQuoteFinalized: true
                }
            }
        });
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    it('mainClass defaults to: true', () => {
        expect(component.mainClass).toEqual(true);
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            component.ngOnInit();
            expect(component.driverMinorViolation.value).toEqual({
                noOfAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none',
                noOfMovingViolations: 'none',
                noOfNotAtFaultAccidents: 'none'
            });
        });
    });
    describe('saveDetails', () => {
        it('makes expected calls', () => {
            const navigationServiceStub: NavigationService = fixture.debugElement.injector.get(NavigationService);
            component.driverMinorViolation.patchValue({
                noOfAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none',
                noOfMovingViolations: 'none',
                noOfNotAtFaultAccidents: 'none'
            });
            spyOn(navigationServiceStub, 'navigateSubRouteToSubRoute').and.callThrough();
            component.saveDetails();
            expect(navigationServiceStub.navigateSubRouteToSubRoute).toHaveBeenCalled();
        });
    });
});
