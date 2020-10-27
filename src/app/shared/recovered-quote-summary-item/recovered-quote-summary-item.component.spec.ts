import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { RecoveredQuoteSummaryItemComponent } from './recovered-quote-summary-item.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ContactInfoComponent', () => {
    let component: RecoveredQuoteSummaryItemComponent;
    let fixture: ComponentFixture<RecoveredQuoteSummaryItemComponent>;
    const mockData = {
        leadLandingScreen: 'drivinghistory',
        marketingData: { campaignID: '534353534' },
        enterprisePartyID: '5534353443',
        quote: { quoteNumber: '424234333' },
        firstName: 'test name',
        monthlyPremiumPrice: '4343',
        primaryEmailAddress: 'test@email.com'
    };
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };
    const mockWindow = {
        dataLayer: []
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecoveredQuoteSummaryItemComponent, PageImageTitleComponent],
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
                {
                    provide: NavigationService,
                    useValue: {
                        upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
                    }
                },
                { provide: Store, useValue: mockedStore }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoveredQuoteSummaryItemComponent);
        component = fixture.componentInstance;
        component.quote = {
            timestamp: '12',
            isQuickQuote: true,
            quickQuoteNumber: '23432432',
            quoteNumber: '343444',
            price: 2322,
            names: {},
            cars: {}
        };
        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should return coreect timestamp for getQuoteTimestamp ', () => {
        const result = component.getQuoteTimestamp();
        expect(result).toEqual('12');
    });
    it('should return coreect quoteNumber for getQuoteNumber ', () => {
        component.quote = {
            timestamp: '12',
            isQuickQuote: false,
            quickQuoteNumber: '23432432',
            quoteNumber: '343444',
            price: 2322,
            names: {},
            cars: {}
        };
        const result = component.getQuoteNumber();
        expect(result).toEqual('343444');
    });
    it('should emit the value on click of saveDetails ', () => {
        const spy = spyOn(component.continueQuote, 'emit');
        component.onContinueQuoteClick();
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith({
            timestamp: '12',
            isQuickQuote: true,
            quickQuoteNumber: '23432432',
            quoteNumber: '343444',
            price: 2322,
            names: {},
            cars: {}
        });
    });
});
