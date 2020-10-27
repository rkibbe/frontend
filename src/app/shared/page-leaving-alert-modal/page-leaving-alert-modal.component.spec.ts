import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PageImageTitleComponent } from '../page-image-title/page-image-title.component';
import { PageLeavingAlertModalComponent } from './page-leaving-alert-modal.component';
import { VertiMaterialModule } from '../verti-material.module';
import { SharedService } from '@services/shared.service';
import { LicenseStatus } from 'src/app/store/models/lead.model';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('PageLeavingAlertModalComponent', () => {
    let component: PageLeavingAlertModalComponent;
    let fixture: ComponentFixture<PageLeavingAlertModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
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
        quote: { quoteNumber: '424234333' },
        isQuoteFinalized: true,
        noOfMovingViolations: 'test',
        noOfAtFaultAccidents: 'test',
        noOfNotAtFaultAccidents: 'test',
        noOfComprehensiveClaims: 'test'
    };

    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };

    beforeEach(async(() => {
        
        TestBed.configureTestingModule({
            declarations: [PageLeavingAlertModalComponent, PageImageTitleComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot({}),
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                VertiMaterialModule,
                TranslateModule.forRoot()
            ],
            providers: [
                SharedService,
                { provide: Store, useValue: mockedStore },
                { provide: MatDialogRef, useValue: mockMatDialog },
                { provide: MAT_DIALOG_DATA, useValue: { code: 6092, message: '' } }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageLeavingAlertModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close dailog for stayOnThePage method', () => {
        component.stayOnThePage();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
    it('should close dailog for leaveAddVehicleFlow method', () => {
        component.leaveAddVehicleFlow();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
});
