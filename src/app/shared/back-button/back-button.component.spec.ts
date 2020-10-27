import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonComponent } from './back-button.component';
import { NavigationService } from '@services/navigation.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VertiMaterialModule } from '../verti-material.module';

import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TitleHolder, Vehicle } from 'src/app/store/models/lead.model';

let mockStore: MockStore<any>;
const initialState = { lead: fromStore.initialState };

describe('BackButtonComponent', () => {
    let component: BackButtonComponent;
    let fixture: ComponentFixture<BackButtonComponent>;
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
    const navigationServiceStub = {
        upDateMarketingData: () => ({}),
        paymentCallBackCompleted: {},
        currentRouteObj: { routeName: 'Test Route' },
        navigate: jasmine.createSpy('navigate'),
        navigateBack: jasmine.createSpy('navigateBack'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
    };
    const mockLocation = {
        back: jasmine.createSpy('back')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BackButtonComponent],
            imports: [BrowserAnimationsModule, RouterTestingModule, VertiMaterialModule],

            providers: [
                provideMockStore({ initialState }),
                { provide: NavigationService, useValue: navigationServiceStub },
                { provide: Location, useValue: mockLocation }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BackButtonComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
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
                quote: {}
            }
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct route name', () => {
        component.ngOnChanges({
            currentRouteIndex: {
                currentValue: 'test value'
            }
        });
        expect(component.currentRoute).toEqual('Test Route');
    });
    xit('currentRoute should NON_DYNAMIC_ROUTE if naviagtion service dont have any route', () => {
        navigationServiceStub.currentRouteObj = undefined;
        component.flow = 'organic';
        component.ngOnChanges({
            currentRouteIndex: {
                currentValue: 'test value'
            }
        });
        expect(component.currentRoute).toEqual('NON_DYNAMIC_ROUTE');
    });
    it('should call location back method on click of goBack for non-dynamic routes', () => {
        component.currentRoute = 'NON_DYNAMIC_ROUTE';
        component.goBack();
        expect(mockLocation.back).toHaveBeenCalled();
    });
    it('should call navigateBack method on click of goBack', () => {
        component.goBack();
        expect(navigationServiceStub.navigateBack).toHaveBeenCalled();
    });
});
