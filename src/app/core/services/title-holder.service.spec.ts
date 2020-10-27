import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, ReplaySubject } from 'rxjs';
import { TitleHolder } from 'src/app/store/models/lead.model';
import { NavigationService } from './navigation.service';
import { TitleHolderService } from './title-holder.service';


describe('TitleHolderService', () => {
    let service: TitleHolderService;
    const routerMockRes = ['titleholder-select', '00Q29000007HGWnEAO-1'];

    const testTitleHolderOptions = [
        {
            type: TitleHolder.OWNED,
            name: 'I DO \u2014 (OWNED)'
        },
        {
            type: TitleHolder.LOAN,
            name: 'A BANK \u2014 (LOAN)'
        },
        {
            type: TitleHolder.LEASE,
            name: 'A DEALER \u2014 (LEASE)'
        },
        {
            type: TitleHolder.COMPANY,
            name: 'A COMPANY / FLEET'
        },
        {
            type: TitleHolder.TRUST,
            name: 'A TRUST'
        },
        {
            type: TitleHolder.UNKNOWN,
            name: `I DON'T KNOW`
        }
    ];
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
    const storeMock = {
        select() {
            return of(mockedStoreData);
        },
        dispatch() {}
    };
    const eventSubject = new ReplaySubject<RouterEvent>(1);

    const routerMock = {
        navigate: jasmine.createSpy('navigate'),
        events: eventSubject.asObservable(),
        url: 'test/url'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, MatDialogModule],
            providers: [
                HttpClient,
                TitleHolderService,
                {
                    provide: NavigationService,
                    useValue: {
                        registerBackHandler: jasmine.createSpy('registerBackHandler'),
                        navigate: jasmine.createSpy('navigate'),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
                        deregisterBackHandler: jasmine.createSpy('deregisterBackHandler')
                    }
                },
                { provide: Store, useValue: storeMock },
                { provide: Router, useValue: routerMock }
            ]
        });
        service = TestBed.get(TitleHolderService);
        eventSubject.next(new NavigationEnd(1, 'regular', 'redirectUrl'));
    }));
    beforeEach(async(() => {
        service['currentVehicleID'] = mockedStoreData[0].vehicleID;
    }));

    it('should be created', () => {
        const titleHolderService = TestBed.get(TitleHolderService);
        expect(titleHolderService).toBeTruthy();
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
    it('should call "continue" method  ', () => {
        const continueMethod = spyOn(service, 'continue').and.callThrough();
        const continueTitleholder = spyOn<any>(service, 'continueTitleholder').and.callThrough();
        service.continue(testTitleHolderOptions[0].type);
        expect(continueMethod).toHaveBeenCalled();
        expect(continueMethod).toHaveBeenCalledWith(testTitleHolderOptions[0].type);
        expect(continueTitleholder).toHaveBeenCalled();
        expect(continueTitleholder).toHaveBeenCalledWith(testTitleHolderOptions[0].type);
    });
    it('should call "continue" method  ', () => {
        const nextBack = jasmine.createSpy('nextBack');
        const back = spyOn(service, 'back').and.callThrough();
        service.back(nextBack);
        expect(back).toHaveBeenCalled();
    });
    it('should call "getCurrentTitleHolder" method  ', () => {
        const getCurrentTitleHolder = spyOn(service, 'getCurrentTitleHolder').and.callThrough();
        service.getCurrentTitleHolder();
        expect(getCurrentTitleHolder).toHaveBeenCalled();
    });
    it('should call "continue" method with "onContactPage" value true', () => {
        service['onContactPage'] = false;
        service['currentVehicleID'] = 'fakeId';

        const nextBack = jasmine.createSpy('nextBack');
        const back = spyOn(service, 'back').and.callThrough();
        service.back(nextBack);
        expect(back).toHaveBeenCalled();
    });
});
