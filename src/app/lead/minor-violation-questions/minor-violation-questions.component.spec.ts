import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { MinorViolationQuestionsComponent } from './minor-violation-questions.component';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import { KoQuestionsListsComponent } from '@shared/ko-questions-lists/ko-questions-lists.component';
import { DataLayerService } from '@services/data-layer.service';
import * as LeadActions from '@app/store/actions/lead.actions';
import { LicenseStatus } from 'src/app/store/models/lead.model';

describe('MinorViolationQuestionsComponent', () => {
    let component: MinorViolationQuestionsComponent;
    let fixture: ComponentFixture<MinorViolationQuestionsComponent>;

    const dialogRefStub = {
        afterClosed() {
            return of(true);
        }
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
    const dialogStub = { open: () => dialogRefStub };
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
            declarations: [MinorViolationQuestionsComponent, KoQuestionsListsComponent],
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
                HttpClientModule
            ],
            providers: [
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                {
                    provide: NavigationService,
                    useValue: {
                        upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
                    }
                },
                { provide: MatDialog, useValue: dialogStub },
                { provide: Store, useValue: mockedStore },
                { provide: window, useValue: mockWindow }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MinorViolationQuestionsComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should dispatch SavePNIData on click of nextQuestion', () => {
        component.nextQuestion();
        expect(mockedStore.dispatch).toHaveBeenCalled();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SavePNIData({
                noOfMovingViolations: 'test',
                noOfAtFaultAccidents: 'test',
                noOfNotAtFaultAccidents: 'test',
                noOfComprehensiveClaims: 'test'
            })
        );
    });
});
