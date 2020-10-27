import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { LicenseStatus } from 'src/app/store/models/lead.model';
import { QuickquoteComponent } from './quickquote.component';
import { TranslateModule } from '@ngx-translate/core';

describe('QuickquoteComponent', () => {
    let component: QuickquoteComponent;
    let fixture: ComponentFixture<QuickquoteComponent>;

    const initialState = { lead: fromStore.initialState };

    const mockData = {
        leadLandingScreen: 'drivinghistory',
        marketingData: { campaignID: '534353534' },
        enterprisePartyID: '5534353443',
        quote: { quoteNumber: '424234333' },
        firstName: 'test name',
        monthlyPremiumPrice: '4343',
        changedMonthlyPrice: '4343',
        monthlyPremium: 7878,
        fullPremium: 7878,
        primaryEmailAddress: 'test@email.com',
        premiumChangeIndicator: -1,
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
        }
    };

    let mockedStore: MockStore<any>;

    const mockWindow = {
        dataLayer: []
    };
    let mockSaveLeadAndNavigate;
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QuickquoteComponent, PageImageTitleComponent],
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
                { provide: window, useValue: mockWindow },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                provideMockStore({ initialState })
                // { provide: Store, useValue: mockedStore }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuickquoteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockSaveLeadAndNavigate = spyOn(TestBed.get(NavigationService), 'saveLeadAndNavigate');
        mockedStore = TestBed.get(Store) as MockStore<any>;
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        mockedStore.setState({
            lead: {
                ...initialState,
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
                }
            }
        });
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should call saveLeadAndNavigate on doContinue click ', () => {
        component.doContinue();
        expect(mockSaveLeadAndNavigate).toHaveBeenCalled();
    });
    it('should return correct value for checkBodyStyleCode method  ', () => {
        const result = component.checkBodyStyleCode('CG');
        expect(result).toBe(true);
    });
});
