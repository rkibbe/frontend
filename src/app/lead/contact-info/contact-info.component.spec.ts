import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@app/shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageImageTitleComponent } from '@app/shared/page-image-title/page-image-title.component';
import { DataLayerService } from '@app/core/services/data-layer.service';
import { ContactInfoComponent } from './contact-info.component';
import * as LeadActions from '@app/store/actions/lead.actions';
import { NavigationService } from '@app/core/services/navigation.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('ContactInfoComponent', () => {
    let component: ContactInfoComponent;
    let fixture: ComponentFixture<ContactInfoComponent>;
    const mockData = {
        leadLandingScreen: 'drivinghistory',
        marketingData: { campaignID: '534353534' },
        enterprisePartyID: '5534353443',
        quote: { quoteNumber: '424234333' },
        phoneNumber: '22344555',
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
            declarations: [ContactInfoComponent, PageImageTitleComponent],
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
                TranslateService,
                { provide: Store, useValue: mockedStore }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should show phone error showPhoneError for onPhoneBlur ', () => {
        component.onPhoneBlur();
        expect(component.showPhonePrefix).toBe(true);
        expect(component.showPhoneError).toBe(true);
    });
    it('should show prefix on phone focus ', () => {
        component.onPhoneFocus();
        expect(component.showPhonePrefix).toBe(true);
    });
    it('should not show email error for vaild email  ', () => {
        component.onEmailBlur();
        expect(component.showEmailError).toBe(false);
    });
    it('should dispatch SavePNIData on click of saveDetails', () => {
        component.saveDetails();
        expect(mockedStore.dispatch).toHaveBeenCalled();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SavePNIData({ primaryEmailAddress: 'test@email.com', phoneNumber: '22344555' })
        );
    });
});
