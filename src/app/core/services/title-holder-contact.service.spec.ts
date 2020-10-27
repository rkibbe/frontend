import { TestBed, async } from '@angular/core/testing';
import { TitleHolderContactService } from './title-holder-contact.service';
import { Store, StoreModule } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { NavigationService } from './navigation.service';
import { ReplaySubject, of } from 'rxjs';
import { TitleHolder, Vehicle, AdditionalInterest } from 'src/app/store/models/lead.model';

describe('TitleHolderContactService', () => {
    let service: TitleHolderContactService;
    const mockNavigationService = {
        navigate: jasmine.createSpy('navigate'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        registerBackHandler: jasmine.createSpy('registerBackHandler'),
        deregisterBackHandler: jasmine.createSpy('deregisterBackHandler')
    };
    const eventSubject = new ReplaySubject<RouterEvent>(1);
    const routerMockRes = ['titleholder-select', '00Q29000007HGWnEAO-1'];
    const routerMock = {
        navigate: jasmine.createSpy('navigate'),
        events: eventSubject.asObservable(),
        url: 'test/url'
    };
    const mockedStoreData = [
        {
            vehicleID: '00Q29000007H2WxEAK-1',
            publicId: '234234',
            year: '2009',
            make: '343',
            model: '2009',
            trim: '676',
            vin: '',
            bodyStyle: 'uuyyu7',
            vinPrefix: 'jgjhjsd',
            bodyStyleDesc: 'hhhjj',
            trimDesc: 'hhjjas',
            bodyStyleCode: '67667',
            stubbedVIN: 'j8778',
            isIncluded: true,
            isAlreadyIncluded: false,
            isADPF: true,
            isQuoteVehicle: false,
            recordStatus: false,
            unrepairDamage: false,
            leaseOrRent: false,
            owned: false,
            titleHolder: {
                OWNED: 'PaidFor',
                LOAN: 'LIEN',
                LEASE: 'LESSOR',
                COMPANY: 'corporationExt',
                TRUST: 'trusteeExt',
                UNKNOWN: 'otherExt'
            },
            isVisible: false,
            isStubbedVin: false
        }
    ];
    const mockParamOne: AdditionalInterest = {
        contactName: 'string',
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        city: 'city',
        state: 'state',
        country: 'country',
        postalCode: 'postalCode',
        additionalInterestType: TitleHolder.COMPANY,
        isAddressVerified: true,
        publicID: '12345'
    };
    const mockEmptyData = {
        vehicles: []
    };
    const storeMock = {
        select() {
            // return of(mockEmptyData);
            return of(mockedStoreData);
        },
        dispatch() {}
    };
    const vehicles = [
        {
            vin: '1N6AD07W05C417494',
            fixedId: 207248,
            hasAfterMarketAlarm: true,
            hasExistingDamage: true,
            isADPFVehicle: false,
            isCommutingToNYNJ: false,
            isNewVehicle: false,
            primaryUseCode: 'pleasure',
            registeredCoOwner: 'None',
            registeredOwner: 'kavin kk',
            registeredStateCode: 'PA',
            statedValue: 18400,
            titleHolderCode: 'PaidFor',
            usedInRideSharing: false,
            bodyStyleCode: '',
            make: 'Nissan',
            model: 'Frontier',
            trim: '',
            year: 2005
        }
    ];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],
            providers: [
                TitleHolderContactService,
                HttpClient,
                { provide: Store, useValue: storeMock },
                { provide: Router, useValue: routerMock },
                { provide: NavigationService, useValue: mockNavigationService }
            ]
        });
        service = TestBed.get(TitleHolderContactService);
        eventSubject.next(new NavigationEnd(1, 'regular', 'redirectUrl'));
        // storeMock.dispatch = jasmine.createSpy('dispatch');
        // storeMock.select = jasmine.createSpy('select').and.returnValue(of(mockedStoreData));
    });
    beforeEach(async(() => {
        service['currentVehicleID'] = mockedStoreData[0].vehicleID;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call "onUrlChange" method with expected response ', () => {
        const onUrlChange = spyOn<any>(service, 'onUrlChange').and.callThrough();
        const setCurrentVehicleParameters = spyOn<any>(service, 'setCurrentVehicleParameters').and.callThrough();
        service['onUrlChange'](routerMockRes);
        expect(onUrlChange).toHaveBeenCalled();
        expect(setCurrentVehicleParameters).toHaveBeenCalled();
        expect(onUrlChange).toHaveBeenCalledWith(routerMockRes);
        expect(setCurrentVehicleParameters).toHaveBeenCalledWith(routerMockRes);
    });
    it('should call "onUrlChange" method with Unexpected response ', () => {
        const onUrlChange = spyOn<any>(service, 'onUrlChange').and.callThrough();
        const resetService = spyOn<any>(service, 'resetService').and.callThrough();
        service['onUrlChange'](['test data']);
        expect(onUrlChange).toHaveBeenCalled();
        expect(onUrlChange).toHaveBeenCalledWith(['test data']);
        expect(resetService).toHaveBeenCalled();
    });
    it('should get vehicleObservable', () => {
        const spyVehicle = spyOnProperty(service, 'vehicleObservable', 'get').and.returnValue(vehicles);
        // const mockGetCurrentVehicle = service['getCurrentVehicle']();
        // const newService = service;
        // spyOn(newService, 'getCurrentVehicle').and.returnValue(false);
        expect(spyVehicle()).toEqual(vehicles);
    });
    it('should call continue()', () => {
        spyOn(service, 'continue').and.callThrough();
        service.continue(mockParamOne);
        expect(service.continue).toHaveBeenCalledWith(mockParamOne);
    });

    it('should call "continue" method  ', () => {
        const continueMethod = spyOn(service, 'continue').and.callThrough();
        const continueAdditionalInt = spyOn<any>(service, 'continueAdditionalInterest').and.callThrough();
        service.continue(mockParamOne);
        expect(continueMethod).toHaveBeenCalled();
        expect(continueMethod).toHaveBeenCalledWith(mockParamOne);
        expect(continueAdditionalInt).toHaveBeenCalled();
        expect(continueAdditionalInt).toHaveBeenCalledWith(mockParamOne);
    });

    it('should call getCurrentTitleHolder()', () => {
        spyOn(service, 'getCurrentTitleHolder').and.callThrough();
        service.getCurrentTitleHolder();
        expect(service.getCurrentTitleHolder).toHaveBeenCalledWith();
    });
    it('should call "continue" method  ', () => {
        const nextBack = jasmine.createSpy('nextBack');
        const back = spyOn(service, 'back').and.callThrough();
        service.back(nextBack);
        expect(back).toHaveBeenCalled();
    });
    it('should call back()', () => {
        const next = new Function();
        spyOn(service, 'back').and.callThrough();
        service.back(next);
        expect(service.back).toHaveBeenCalledWith(next);
    });
    it('should call "getCurrentTitleHolder" method  ', () => {
        const getCurrentTitleHolder = spyOn(service, 'getCurrentTitleHolder').and.callThrough();
        service.getCurrentTitleHolder();
        expect(getCurrentTitleHolder).toHaveBeenCalled();
    });
});
