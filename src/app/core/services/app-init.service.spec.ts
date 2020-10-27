import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppSettings } from '@shared/settings/app-settings';
import { of, throwError } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { AppInitService } from './app-init.service';
import { LeadGenService } from './lead-gen.service';
import { RouteService } from './route.service';
import { ConfigService } from './conig.service';
import { SetConfigurationAction } from '@app/store/actions/configuration.action';

const initialState = {
    lead: fromStore.initialState,
    error: { code: '', message: '' },
    routes: []
};
let appInitService: AppInitService;
let httpTestingController: HttpTestingController;
let mockStore: MockStore<any>;
const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    config: { unshift: jasmine.createSpy('unshift') }
};
const mockWindow = {
    location: { href: 'https://konydev02.mapfreinsurance.com/car-insurance?leadID=65656556' }
};
const mockedStore = {
    select() {
        return of({});
    },
    dispatch() {}
};
const mockRoutes = {
    routes: [
        {
            referringURL: '',
            routeName: 'basicinfo',
            visible: true,
            preFill: true,
            generateQuickQuotePrice: false,
            rateQuote: false,
            finalizeQuote: false,
            updatePaymentPlan: false,
            evo: false,
            replaceUrl: false,
            validateDriver: false,
            validateRules: false
        }
    ]
};
const mockRouteData = [
    {
        referringURL: '',
        routeName: 'basicinfo',
        visible: true,
        preFill: true,
        generateQuickQuotePrice: false,
        rateQuote: false,
        finalizeQuote: false,
        updatePaymentPlan: false,
        evo: false,
        replaceUrl: false,
        validateDriver: false,
        validateRules: false
    },
    {
        referringURL: '',
        routeName: 'contactinfo',
        visible: true,
        preFill: true,
        generateQuickQuotePrice: false,
        rateQuote: false,
        finalizeQuote: false,
        updatePaymentPlan: false,
        evo: false,
        replaceUrl: false,
        validateDriver: false,
        validateRules: false
    }
];
const mockUrl = 'https://cert-hp.evosnap.com/#tokenconfirm';
const mockRoutesSpy = {
    getRoutes: jasmine.createSpy('getRoutes').and.returnValue(of(mockRouteData)),
    getRoutesFromFallback: jasmine.createSpy('getRoutesFromFallback').and.returnValue(
        of({
            PA: {
                organic: [
                    {
                        referringURL: '',
                        routeName: 'basicinfo',
                        visible: true,
                        preFill: true,
                        generateQuickQuotePrice: false,
                        rateQuote: false,
                        finalizeQuote: false,
                        updatePaymentPlan: false,
                        evo: false,
                        replaceUrl: false,
                        validateDriver: false,
                        validateRules: false
                    }
                ]
            }
        })
    )
};
const mockConfigSpy = {
    getConfiguration: jasmine.createSpy('getConfiguration').and.returnValue(
        of({
            location: {
                lattitude: 41.2033216,
                longitude: -77.19452469999999
            }
        })
    )
};

describe('AppInitService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],
            providers: [
                AppInitService,
                LeadGenService,
                RouteService,
                AppSettings,
                { provide: Router, useValue: mockRouter },
                provideMockStore({ initialState }),
                {
                    provide: RouteService,
                    useValue: mockRoutesSpy
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigSpy
                }
            ]
        });
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            ...initialState,
            lead: {
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: [],
                    drivers: [],
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
            },
            routes: mockRoutes
        });

        appInitService = TestBed.get(AppInitService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', inject([AppInitService], (service: AppInitService) => {
        service.fetchRoutes();
        expect(service).toBeTruthy();
    }));
    it('should have correct landing route ', () => {
        appInitService.fetchRoutes();
        spyOn(appInitService, 'tokenConfirmed').and.returnValue(mockUrl);
        expect(appInitService['routeService'].landingRoute).toEqual('basicinfo');
        expect(mockRouter.navigate).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith([appInitService.visibleRouteList[0].routeName], {
            queryParams: {},
            queryParamsHandling: 'merge'
        });
    });
    it('should navigate to recoverQuote  ', () => {
        appInitService.flowType = 'recoverQuote';
        appInitService.fetchRoutes();
        spyOn(appInitService, 'tokenConfirmed').and.returnValue(mockUrl);
        expect(mockRouter.navigate).toHaveBeenCalled();
    });
    it('should navigate to recoverQuote for error response ', () => {
        mockConfigSpy.getConfiguration.and.returnValue(throwError(''));
        mockRoutesSpy.getRoutes.and.returnValue(throwError(''));
        appInitService.fetchRoutes();
        spyOn(appInitService, 'tokenConfirmed').and.returnValue(mockUrl);
        expect(mockRouter.navigate).toHaveBeenCalled();
    });
});
