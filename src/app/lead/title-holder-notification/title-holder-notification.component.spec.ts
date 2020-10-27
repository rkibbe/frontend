import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { LienHolderService } from '@services/lien-holder.service';
import { NavigationService } from '@services/navigation.service';
import { TitleHolderContactService } from '@services/title-holder-contact.service';
import { TrilliumAddressService } from '@services/trillium-address.service';
import { AddressInputComponent } from '@shared/address-input/address-input.component';
import { AutofillAddressComponent } from '@shared/autofill-address/autofill-address.component';
import { ManualAddressComponent } from '@shared/manual-address/manual-address.component';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of, Subject } from 'rxjs';
import { AdditionalInterest, TitleHolder } from 'src/app/store/models/lead.model';
import { TitleHolderNotificationComponent } from './title-holder-notification.component';

describe('TitleHolderNotificationComponent', () => {
    let component: TitleHolderNotificationComponent;
    let fixture: ComponentFixture<TitleHolderNotificationComponent>;

    let vehicles;
    let currentRouteObj;
    let testLienHolder;
    let mockedLienHolderService;
    let mockedTrilliumAddressService;
    let mockedNavigationService;
    let mockedTitleHolderContactService;
    let testAddress;
    let titleHolderNotifyComponent;
    let storeMock;
    let vehicleObservable;
    let addressControl, lienHolderControl;
    let titleHolderContactService;
    let testTitleHolder;
    let lienHolders;

    beforeEach(async(() => {
        storeMock = {
            select() {
                return of(vehicles);
            },
            dispatch() {}
        };
        testAddress = {
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            county: 'string',
            country: 'string',
            manualAddress: false,
            isAddressVerified: false,
            isAutoComplete: false
        };
        testLienHolder = {
            name: 'name',
            address: testAddress
        };
        testTitleHolder = {
            OWNED: 'PaidFor',
            LOAN: 'LIEN',
            LEASE: 'LESSOR',
            COMPANY: 'corporationExt',
            TRUST: 'trusteeExt',
            UNKNOWN: 'otherExt'
        };
        const testAdditionalInterests = [
            {
                publicID: '123456',
                additionalInterestType: testTitleHolder,
                contactName: 'string',
                addressLine1: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                country: 'string',
                postalCode: 'string',
                isAddressVerified: true
            }
        ];
        vehicles = [
            {
                vin: '1N6AD07W05C417494',
                fixedId: 207248,
                isNewVehicle: false,
                titleHolderCode: 'PaidFor',
                usedInRideSharing: false,
                bodyStyleCode: '',
                make: 'Nissan',
                model: 'Frontier',
                trim: '',
                year: 2005,
                isQuoteVehicle: true,
                additionalInterests: testAdditionalInterests
            },
            {
                vin: '1N6AD07W05C417495',
                fixedId: 207249,
                isNewVehicle: false,
                titleHolderCode: 'PaidFor',
                usedInRideSharing: false,
                bodyStyleCode: '',
                make: 'Nissan',
                model: 'Frontier',
                trim: '',
                year: 2006,
                isQuoteVehicle: true,
                additionalInterests: testAdditionalInterests
            }
        ];
        const temp = ['name', testAddress];
        mockedLienHolderService = {
            getLienHolders() {
                return of(temp);
            }
        };
        mockedTrilliumAddressService = {
            verifyAddress() {
                return of(testAddress);
            }
        };
        mockedTitleHolderContactService = {
            getCurrentTitleHolder() {
                return of(TitleHolder.LEASE);
            },
            continue() {
                return of({});
            }
        };

        mockedTitleHolderContactService = {
            vehicleObservable: jasmine.createSpy('vehicleObservable'),
            getCurrentTitleHolder: jasmine.createSpy('getCurrentTitleHolder'),
            continue: jasmine.createSpy('continue')
        };
        mockedNavigationService = {
            upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
            registerBackHandler: jasmine.createSpy('registerBackHandler'),
            currentRouteObj: { preFill: true },

            timeoutThenRouteToSystemFailure: jasmine.createSpy('timeoutThenRouteToSystemFailure')
        };
        TestBed.configureTestingModule({
            declarations: [
                TitleHolderNotificationComponent,
                AddressInputComponent,
                AutofillAddressComponent,
                ManualAddressComponent
            ],
            imports: [
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                HttpTestingController,
                AddressPipe,
                { provide: NavigationService, useValue: mockedNavigationService },
                { provide: TrilliumAddressService, useValue: mockedTrilliumAddressService },
                { provide: LienHolderService, useValue: mockedLienHolderService },
                // { provide: TitleHolderContactService, useValue: mockedTitleHolderContactService },
                { provide: Store, useValue: storeMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
            // }).compileComponents();
        }).overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [AddressInputComponent] }
        });
        fixture = TestBed.createComponent(TitleHolderNotificationComponent);
        component = fixture.componentInstance;
        titleHolderContactService = TestBed.get(TitleHolderContactService);
        vehicleObservable = spyOn(titleHolderContactService, 'vehicleObservable').and.returnValue(of(vehicles));
        component.filteredLienHolders$ = testLienHolder;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct publicId ', fakeAsync(() => {
        vehicleObservable.and.returnValue({ bodyStyleCode: 'CG' });
        component.ngOnInit();
        tick(100);
        console.log('///////', component['publicId']);
        // expect(component['publicId']).toEqual('123456');
    }));

    it('should have to call prefillDefaultValues()', fakeAsync(() => {
        fixture.autoDetectChanges();
        tick();
        component.prefillDefaultValues(vehicles);

        expect(vehicles[0].isQuoteVehicle).toBeTruthy();
        expect(mockedNavigationService.currentRouteObj.preFill).toBeTruthy();
        expect(vehicles[0].additionalInterests.length).toBeTruthy();

        const interest: AdditionalInterest = vehicles[0].additionalInterests[0];
        expect(interest.additionalInterestType).toEqual(testTitleHolder);

        tick(1000);

        expect(component.prefillDefaultValues).toBeTruthy();
        expect(mockedNavigationService.currentRouteObj.preFill).toBeTruthy();
    }));

    it('should have to call updateAddressOnLienHolderChange()', fakeAsync(() => {
        fixture.autoDetectChanges();
        tick();
        component.updateAddressOnLienHolderChange(testLienHolder);
        component['addressControl'] = testLienHolder.address;
        // addressControl = testLienHolder.address;
        tick(1000);
        expect(component.updateAddressOnLienHolderChange).toBeTruthy();
        // expect(titleHolderNotifyComponent['addressControl']).toEqual(testLienHolder.address);
    }));

    it('should check addressControl value', fakeAsync(() => {
        fixture.autoDetectChanges();
        tick();
        component.updateAddressOnLienHolderChange(testLienHolder);
        lienHolders = ['string', testAddress];
        // spyOn(lienHolders, 'slice');
        lienHolders.slice();
        tick(1000);
        expect(component.updateAddressOnLienHolderChange).toBeTruthy();
    }));

    it('should check getLienHolderOptions()', fakeAsync(() => {
        fixture.autoDetectChanges();
        tick();
        component.getLienHolderOptions();
        lienHolders = ['string', testAddress];
        // spyOn(lienHolders, 'slice');
        lienHolders.slice();
        tick(1000);
        expect(component.getLienHolderOptions).toBeTruthy();
    }));

    it('should have to call filterLienHolders()', fakeAsync(() => {
        fixture.autoDetectChanges();
        tick();
        const name = testLienHolder.name;
        component.filterLienHolders(name);
        const searchChars = name.toLowerCase().replace(/\W/g, '');
        lienHolders = ['string', testAddress];
        lienHolders.slice();
        tick(1000);
        expect(searchChars).toBeTruthy();
        tick();
        expect(component.filterLienHolders).toBeTruthy();
    }));
});
