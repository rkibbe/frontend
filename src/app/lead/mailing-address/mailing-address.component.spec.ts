import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Store, StoreModule } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { LicenseStatus } from 'src/app/store/models/lead.model';
import { MailingAddressComponent } from './mailing-address.component';
import { TranslateModule } from '@ngx-translate/core';



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
        updateMailingAddress: false,
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
const mockDataUpdateMailingFlagTrue = {
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
        updateMailingAddress: true,
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

describe('MailingAddressComponent', () => {
    let component: MailingAddressComponent;
    let fixture: ComponentFixture<MailingAddressComponent>;

    const storeMock = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('dispatch')
    };
    let mockedStore, mockUpdateMarketingData, mockNaviagte;
    const mockWindow = {
        dataLayer: []
    };
    let newComponent;
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MailingAddressComponent, AddressPipe, PageImageTitleComponent],
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
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                AddressPipe,
                { provide: window, useValue: mockWindow },
                { provide: Store, useValue: storeMock },
                { provide: DataLayerService, useValue: dataLayerServiceStub }
                // {
                //     provide: NavigationService,
                //     useValue: {
                //         upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                //         saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
                //     }
                // }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MailingAddressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        newComponent = component;
        mockedStore = TestBed.get(Store);
        mockUpdateMarketingData = spyOn(TestBed.get(NavigationService), 'upDateMarketingData');
        mockNaviagte = spyOn(TestBed.get(NavigationService), 'navigate');
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct mailingAddress if values found store ', () => {
        component.ngOnInit();
        expect(component.mailingAddress).toEqual(mockData.quote.mailingAddress);
        expect(component.residentialControl.value).toEqual('Y');
    });
    it('should have correct mailingAddress if values found store ', () => {
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockDataUpdateMailingFlagTrue));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        component.ngOnInit();
        expect(component.mailingAddress).toEqual(mockData.quote.mailingAddress);
        expect(component.residentialControl.value).toEqual('N');
    });
    it('should have showAddressForm flag true if updateMailingAddress value "N" in store ', () => {
        component.onButtonToggleClick('N');
        expect(component.showAddressForm).toEqual(true);
        expect(mockUpdateMarketingData).toHaveBeenCalled();
    });
    it('should have showAddressForm flag false if updateMailingAddress value "Y" on click of onButtonToggleClick ', () => {
        component.onButtonToggleClick('Y');
        expect(component.showAddressForm).toEqual(false);
        expect(mockUpdateMarketingData).toHaveBeenCalled();
        expect(mockNaviagte).toHaveBeenCalled();
    });
    it('should call onSubmit and addressControl as observable subscribing', () => {
        const mockAddress = {
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            county: 'string',
            country: 'string'
        };
        component.addressControl.setValue(of(mockAddress));
        component.onSubmit();
        component.saveMailingAddess(mockAddress);
        expect(mockedStore.dispatch).toHaveBeenCalled();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SaveQuote({
                mailingAddress: mockAddress
            })
        );
    });
    it('should store address in SaveQuote and call saveMailingAddess ', () => {
        const mockAddress = {
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            county: 'string',
            country: 'string'
        };
        spyOn(component, 'saveMailingAddess').and.callThrough();
        spyOn(newComponent, 'navigateToNextPage').and.callThrough();
        component.saveMailingAddess(mockAddress);
        expect(mockedStore.dispatch).toHaveBeenCalled();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SaveQuote({
                mailingAddress: mockAddress
            })
        );
        expect(component['navigateToNextPage']).toHaveBeenCalled();
    });
});
