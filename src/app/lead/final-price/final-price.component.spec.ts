import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalPriceComponent } from './final-price.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromStore from '../../store/reducers/lead.reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

const leadData = {
    lead: {
        leadID: '00Q29000007CVEjEAO',
        publicID: 'pc:164915',
        sessionUUID: '111',
        genderCode: 'F',
        genderValue: 'Female',
        maritalStatusCode: 'S',
        maritalStatusValue: '',
        primaryAddress: {},
        priorAddress: null,
        primaryEmailAddress: 'dsgdfgfg@dgfsdg.fdg',
        phoneNumber: '4576756786',
        quickQuote: {},
        quote: {
            quoteNumber: 'Q1000065886',
            eligibilityAnswers: {},
            discounts: ['advancedShoppingCredit', 'claimsFreeDiscount', 'goodPayerDiscount', 'boundOnlineCredit'],
            isADPFQuote: true,
            fullPremium: 1048,
            monthlyPremium: 209.6,
            isQuoteFinalized: true,
            customQuote: {
                publicID: 'pc:209132',
                branchName: 'CUSTOM',
                branchCode: 'zibguqq8khdec64arr9upqokema',
                offeringName: 'Current Coverage',
                fullQuote: true,
                isCustom: true,
                isQuoteCustomized: false,
                termMonths: 6,
                periodStartDate: '2020-07-01T04:01:00Z',
                periodEndDate: '2021-01-01T05:01:00Z',
                quoteRated: true
            },
            policyCoverage: {
                uMBILimit: '$100K / $300K',
                selCodeUMBI: 'zhdhmu6kbmoke3d0fesnfis2o59',
                selValueUMBI: '100,000/300,000',
                stackedUMBILimit: 'No',
                selCodeStackUMBI: 'false',
                selValueStackUMBI: 'No',
                bILimit: '$100K / $300K',
                selCodeBiLimit: 'z6ogs1pkqqt8ne7b85mrv7vptkb',
                selValueBiLimit: '100,000/300,000',
                uIMBILimit: '$100K / $300K',
                selCodeUIMBI: 'pack_258',
                selValueUIMBI: '100,000/300,000',
                stackedUIMBILimit: 'No',
                selCodeStackUIMBI: 'false',
                selValueStackUIMBI: 'No',
                tort: 'Limited',
                selCodeTort: 'limited',
                selValueTort: 'Limited',
                pDLimit: '$50K',
                selCodeProperty: 'zh6gugqov6r55b5qqcsgs88gou8',
                selValueProperty: '50,000',
                futureAccident: true,
                repairAssistance: true,
                identityTheft: 'No',
                idTheft: false,
                medical: '$5K',
                selCodeMedical: 'papkg0d2qrfr3f5p4joneh4oo208',
                selValueMedical: '$5,000',
                extraMedical: 'No Coverage',
                selCodeExtraMed: '',
                selValueExtraMed: '',
                income: 'No Coverage',
                selCodeIncome: '',
                selValueIncome: '',
                death: 'No Coverage',
                selCodeDeath: '',
                selValueDeath: '',
                funeral: '$2,500',
                selCodeFuneral: 'pan6hmolvuj8180h144nqca84r28',
                selValueFuneral: '2,500',
                combined: 'No Coverage',
                selCodeCombined: '',
                selValueCombined: ''
            },
            verificationDocuments: [],
            savings: '386',
            pIFSaving: 68,
            premiumChangeIndicator: -1,
            totalPriorFullQuote: 1103,
            monthlyPremiumPriorFullQuote: 220.6,
            changedFullPrice: '-55.00',
            changedMonthlyPrice: '-11.00',
            nextPaymentDueDate: { year: 2020, month: 8, day: 3 }
        },
        marketingData: {},
        generateQuickQuotePrice: false,
        rateQuote: false,
        finalizeQuote: true,
        updatePaymentPlan: false,
        evo: false,
        firstName: 'Timothy11',
        lastName: 'Berry11',
        dateOfBirth: { year: 1973, month: 5, day: 14 },
        enterprisePartyID: '0012900000Wd0fwAAB',
        gender: 'F',
        maritalStatus: 'S',
        residenceOwnership: 'rent',
        residenceOwnershipValue: 'Rent',
        education: 'highschooldiplomaext',
        noOfMovingViolations: 'none',
        noOfAtFaultAccidents: 'none',
        noOfNotAtFaultAccidents: 'none',
        noOfComprehensiveClaims: 'none',
        recoverQuote: true,
        updateQuote: false,
        validateDriver: false,
        validateRules: false
    }
};

describe('FinalPriceComponent', () => {
    let component: FinalPriceComponent;
    let fixture: ComponentFixture<FinalPriceComponent>;
    let mockStore: MockStore<any>;
    let newComponent;
    const initialState = { lead: fromStore.initialState };
    const mockNavigationService = {
        navigate: jasmine.createSpy('navigate'),
        previousRoute: 'signforms',
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        upDateMarketingData: jasmine.createSpy('.upDateMarketingData')
    };

    const mockedStore = {
        select() {
            return of();
        },
        dispatch() {}
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FinalPriceComponent, PageImageTitleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
                CurrencyPipe,
                { provide: Store, useValue: mockedStore },
                { provide: NavigationService, useValue: mockNavigationService },
                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FinalPriceComponent);
        component = fixture.componentInstance;
        newComponent = component;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.select = jasmine.createSpy('select').and.returnValue(of(leadData.lead));
        mockStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call doContinue and save quote with selected plan', () => {
        const selectedPlan = 'pp:01';
        component.doContinue(selectedPlan);
        fixture.detectChanges();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SaveQuote({ selectedPaymentPlan: selectedPlan })
        );
        expect(mockNavigationService.saveLeadAndNavigate).toHaveBeenCalledWith(newComponent['ngDestroy$']);
    });
});
