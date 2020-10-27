import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoQuestionThreeComponent } from './ko-question-three.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { Store } from '@ngrx/store';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { NavigationService } from '@services/navigation.service';
import { of } from 'rxjs/internal/observable/of';
import { Subscription } from 'rxjs';
import { DataLayerService } from '@services/data-layer.service';
import * as LeadActions from '@app/store/actions/lead.actions';
import { TranslateModule } from '@ngx-translate/core';

describe('KoQuestionThreeComponent', () => {
    let component: KoQuestionThreeComponent;
    let fixture: ComponentFixture<KoQuestionThreeComponent>;
    let mockedFormBuilder, mockedStore, mockedNavigationService, eligibilityAnswers, mockedDataLayerService;
    const mockedQuoteData = {
        quote: {
            eligibilityAnswers: {
                ineligibleVehicle: 'ineligibleVehicle',
                licenseRevoked: 'licenseRevoked',
                majorViolations: 'majorViolations'
            }
        }
    };
    beforeEach(async(() => {
        mockedStore = {};
        mockedFormBuilder = {};
        eligibilityAnswers = {
            ineligibleVehicle: 'ineligibleVehicle',
            majorViolations: 'majorViolations',
            licenseRevoked: 'licenseRevoked'
        };
        mockedNavigationService = {
            upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
            saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
        };
        mockedDataLayerService = {
            pushStepTotal: jasmine.createSpy('pushStepTotal')
        };

        component = new KoQuestionThreeComponent(
            mockedFormBuilder,
            mockedStore,
            mockedNavigationService,
            mockedDataLayerService
        );

        TestBed.configureTestingModule({
            declarations: [KoQuestionThreeComponent, PageImageTitleComponent],
            imports: [BrowserAnimationsModule,TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, VertiMaterialModule],
            providers: [
                { provide: Store, useValue: mockedStore },
                { provide: NavigationService, useValue: mockedNavigationService },
                { provide: DataLayerService, useValue: mockedDataLayerService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KoQuestionThreeComponent);
        component = fixture.componentInstance;
        mockedStore = TestBed.get(Store);
        mockedDataLayerService = TestBed.get(DataLayerService);

        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedQuoteData));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have koQuestion method triggered', () => {
        fixture.autoDetectChanges();
        component.koQuestion();
        expect(component.loaderStopped).toEqual(false);
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.SaveQuote({
                eligibilityAnswers: { ...component.eligibilityAnswers, ...component.koQuestionThree.value }
            })
        );
        fixture.detectChanges();
    });

    it('should unsubscribe from all subscriptions', () => {
        component.koQuestionThree$ = new Subscription();
        expect(component.koQuestionThree$.closed).toBe(false);
        component.ngOnDestroy();
        expect(component.koQuestionThree$.closed).toBe(true);
    });
});
