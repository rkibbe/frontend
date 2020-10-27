import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { WalmericDialogModalComponent } from 'src/app/core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { LicenseStatus } from 'src/app/store/models/lead.model';
import { PriceChangeComponent } from './price-change.component';
import { TranslateModule } from '@ngx-translate/core';



describe('PriceChangeComponent', () => {
    let component: PriceChangeComponent;
    let fixture: ComponentFixture<PriceChangeComponent>;
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
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };
    const mockWindow = {
        dataLayer: []
    };
    const mockMatDialog = {
        open: jasmine.createSpy('open')
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };
    let mockNavigate;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PriceChangeComponent, PageImageTitleComponent],
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
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                { provide: Store, useValue: mockedStore }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PriceChangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(TestBed.get(NavigationService), 'saveLeadAndNavigate');
        mockNavigate = spyOn(TestBed.get(NavigationService), 'navigate');
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });

    it('should naviagate to next on click of doContinue ', () => {
        component.doContinue();
        expect(mockNavigate).toHaveBeenCalled();
    });
    it('should open CancelModalComponent  on click of openWalmaric ', () => {
        component.openWalmaric();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    });
});
