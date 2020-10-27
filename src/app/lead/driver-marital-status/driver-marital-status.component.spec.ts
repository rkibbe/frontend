import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, convertToParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';
import { DriverMaritalStatusComponent } from './driver-marital-status.component';
import { Subscription, of, interval, throwError } from 'rxjs';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { TypeListService } from 'src/app/core/services/type-list.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as ErrorActions from '@app/store/actions/error.actions';

describe('DriverMaritalStatusComponent', () => {
    let component: DriverMaritalStatusComponent;
    let fixture: ComponentFixture<DriverMaritalStatusComponent>;
    let testMaritalStatusOptions, testLead;
    let mockedStore, mockedDataLayerService;
    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };
    const customQuoteData = {
        fullQuote: true,
        isCustom: false,
        isQuoteCustomized: true
    };
    const quoteData = {
        quoteNumber: '00Q29000007IripEAC',
        quoteStatus: 'string',
        isADPFQuote: true,
        newCarReplacement: true,
        policyCoverage: {
            bILimit: '$25K/$50K',
            uMBILimit: '$25K/$50K',
            uIMBILimit: '$25K/$50K',
            tort: 'Limited',
            pDLimit: '$25K',
            futureAccident: true,
            currentAccident: true,
            immediateAccident: true,
            repairAssistance: true,
            extraMedical: 'NoCoverage',
            combined: 'NoCoverage',
            death: 'NoCoverage',
            funeral: 'NoCoverage',
            idTheft: false,
            medical: '$5K',
            income: 'NoCoverage',
            newCarReplacement: true
        },
        customQuote: customQuoteData,
        periodStartDate: ''
    };

    const quickQuoteData = {
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
                maritalStatusCode: '2424'
            }
        ],
        vehicles: [
            {
                publicID: 'pc:217756',
                year: 2020,
                make: 'TOYOTA',
                model: 'COROLLA',
                trim: 'Sedan',
                vinPrefix: 'JTDP4RCE4LJ016313',
                isIncluded: true,
                isADPF: false,
                vehicleID: '00Q29000007I3Z0EAK-1'
            },
            {
                publicID: 'pc:217757',
                year: 2019,
                make: 'TOYOTA',
                model: 'COROLLA',
                trim: 'Sedan',
                vinPrefix: 'JTDP4RCE4LJ016314',
                isIncluded: true,
                isADPF: false,
                vehicleID: '00Q29000007I3Z0EAK-2'
            }
        ],
        monthlyPremiumPrice: null,
        fullTermPremiumPrice: null,
        policyTerm: ''
    };
    let fb, mockedRouter, activatedRouteStub, mockedMatDialog, mockedNavigationService, storeStub, typeListService;
    let testFormData, navigationServiceStub, driverObject, testEmptyData;
    const mockGetMaritalStatusOptions = {
        getMaritalStatusOptions: jasmine.createSpy('getMaritalStatusOptions')
    };
    beforeEach(() => {
        mockedStore = {};
        fb = {};
        mockedRouter = {};
        mockedMatDialog = {};
        mockedNavigationService = {};
        typeListService = {};
        driverObject = {
            driverID: '1',
            isIncluded: false,
            isADPF: false,
            isAlreadyIncluded: false,
            firstName: 'ggg',
            lastName: 'fff',
            genderCode: 'F',
            dateOfBirth: { year: 2000, month: 12, day: 22 },
            age: 19,
            genderValue: 'Female'
        };
        const formBuilderStub = { group: object => ({}) };
        const formBuilder: FormBuilder = new FormBuilder();

        storeStub = {
            // select: arg => ({
            //     subscribe: () => ({}),
            //     pipe: () => ({ subscribe: () => ({}) })
            // }),
            select() {
                return of(driverObject);
            },
            dispatch() { }
            // dispatch: arg => ({})
        };
        const routerStub = { navigate: (array, object) => ({}) };
        activatedRouteStub = { paramMap: of(convertToParamMap({ id: '12356', jobId: '7788787' })) };
        // navigationServiceStub = {
        //     upDateMarketingData: () => ({}),
        //     navigateSubRouteToSubRoute: () => ({})
        // };
        navigationServiceStub = {
            upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
            navigateSubRouteToSubRoute: jasmine.createSpy('navigateSubRouteToSubRoute'),
            gotoRouteByName: jasmine.createSpy('gotoRouteByName')
        };
        const matDialogStub = { open: (errorDialogModalComponent, object) => ({}) };
        const dataLayerServiceStub = {};

        testMaritalStatusOptions = [
            {
                code: 'code1',
                name: 'value1'
            },
            {
                code: 'code2',
                name: 'value2'
            },
            {
                code: 'code3',
                name: 'value3'
            }
        ];

        testLead = {
            maritalStatusCode: testMaritalStatusOptions[1].code
        };
        testFormData = {
            selected: {
                maritalStatusCode: testMaritalStatusOptions[1].code
            },
            allOptions: testMaritalStatusOptions
        };
        testEmptyData = {
            selected: {
                maritalStatusCode: testMaritalStatusOptions[1].code
            },
            allOptions: [
                {
                    code: 'temp1',
                    name: 'temp1'
                },
                {
                    code: 'temp2',
                    name: 'temp2'
                }
            ]
        };
        mockedDataLayerService = {};
        component = new DriverMaritalStatusComponent(
            fb,
            storeStub,
            mockedRouter,
            activatedRouteStub,
            mockedMatDialog,
            mockedNavigationService,
            mockedDataLayerService,
            typeListService
        );
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [DriverMaritalStatusComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: Store, useValue: storeStub },
                {
                    provide: TypeListService,
                    useValue: mockGetMaritalStatusOptions
                },
                provideMockStore({ initialState }),
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: NavigationService, useValue: navigationServiceStub },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: DataLayerService, useValue: dataLayerServiceStub }
                // { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: 1 })) } }
            ]
        });
        fixture = TestBed.createComponent(DriverMaritalStatusComponent);
        component = fixture.componentInstance;
        // mockGetMaritalStatusOptions = spyOn(TestBed.get(TypeListService), 'getMaritalStatusOptions').and.returnValue(
        //     of([{ code: 'test', discription: 'test des' }])
        // );
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: quickQuoteData,
                quote: quoteData
            }
        });
        mockGetMaritalStatusOptions.getMaritalStatusOptions.and.returnValue(
            of([{ code: 'test', discription: 'test des' }])
        );
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    it('can load instance', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                error: {
                    code: 'test',
                    message: 'test msg'
                }
            }
        });
        component.navigateToNextPage();
    });
    it('can load instance', () => {
        mockGetMaritalStatusOptions.getMaritalStatusOptions.and.returnValue(throwError(''));
        component.ngOnInit();
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new ErrorActions.SetErrorAction({
                code: 600,
                message: 'Service Failure/down'
            })
        );
    });

    it('should create a form with no default values and query store for lead status', fakeAsync(() => {
        storeStub.select = jasmine.createSpy('select').and.returnValue(of());

        component.ngOnInit();
        tick();

        const maritalControl = component.driverMaritalStatusForm['maritalStatusCode'];

        expect(maritalControl).toBeFalsy('marital status should not have a default value');
        expect(maritalControl).toEqual(undefined);
    }));

    it('should have save the form data', fakeAsync(() => {
        storeStub.dispatch = jasmine.createSpy('dispatch');
        storeStub.select = jasmine.createSpy().and.returnValues(interval(10000), of(false));
        expect(component.loaderStopped).toBeFalsy();
        component.setDetails(testFormData);
        tick();
        component.driverObj.maritalStatusValue = component.getMaritalStatusValue(testFormData);
        component.getMaritalStatusValue(testFormData);
        expect(component.driverObj).toEqual(testFormData.selected);
    }));

    it('should have to check marital status value', fakeAsync(() => {
        storeStub.dispatch = jasmine.createSpy('dispatch');
        storeStub.select = jasmine.createSpy().and.returnValues(interval(10000), of(false));
        expect(component.loaderStopped).toBeFalsy();
        component.setDetails(testFormData);
        tick();
        component.driverObj.maritalStatusValue = component.getMaritalStatusValue(testEmptyData);
        const emptyData = component.getMaritalStatusValue(testEmptyData);
        expect(emptyData).toEqual('');
    }));

    it('should have to call saveAndNaviage method', fakeAsync(() => {
        storeStub.dispatch = jasmine.createSpy('dispatch');
        storeStub.select = jasmine.createSpy('select').and.returnValues(of(testFormData), of(true));
        component.setDetails(testFormData);
        component.driverObj.maritalStatusValue = component.getMaritalStatusValue(testFormData);
        tick();
        component.saveAndNavigate();
        tick();
        expect(navigationServiceStub.navigateSubRouteToSubRoute).toHaveBeenCalledTimes(1);
    }));

    it('should unsubscribe from subscriptions on delete', () => {
        component.driverMaritalStatusForm$ = new Subscription();
        component.errorSubscription = new Subscription();
        component.loaderSubscription = new Subscription();
        component.leadSub = new Subscription();

        expect(component.driverMaritalStatusForm$.closed).toBeFalsy();
        expect(component.errorSubscription.closed).toBeFalsy();
        expect(component.loaderSubscription.closed).toBeFalsy();
        expect(component.leadSub.closed).toBeFalsy();

        component.ngOnDestroy();

        expect(component.driverMaritalStatusForm$.closed).toBeTruthy();
        expect(component.errorSubscription.closed).toBeTruthy();
        expect(component.loaderSubscription.closed).toBeTruthy();
        expect(component.leadSub.closed).toBeTruthy();
    });
    it('marital status should be empty if  there is no marital status code existed', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    ...quickQuoteData,
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
                            maritalStatusCode: ''
                        }
                    ]
                },
                quote: quoteData
            }
        });
        component.ngOnInit();
        expect(component.driverObj.maritalStatusValue).toBe('');
    });
    it('marital status value should be set if matching marital status code existed', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    ...quickQuoteData,
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
                            maritalStatusCode: 'M'
                        }
                    ]
                },
                quote: quoteData
            }
        });
        mockGetMaritalStatusOptions.getMaritalStatusOptions.and.returnValue(
            of([{ code: 'M', name: 'married', discription: 'Married' }])
        );
        component.ngOnInit();
        expect(component.driverObj.maritalStatusValue).toBe('married');
    });
});
