import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoQuestionTwoComponent } from './ko-question-two.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { Store } from '@ngrx/store';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { KoQuestionsListsComponent } from '@shared/ko-questions-lists/ko-questions-lists.component';
import { NavigationService } from '@services/navigation.service';
import { of } from 'rxjs/internal/observable/of';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('KoQuestionTwoComponent', () => {
    let component: KoQuestionTwoComponent;
    let fixture: ComponentFixture<KoQuestionTwoComponent>;
    let mockedFormBuilder, mockedStore, mockedNavigationService, eligibilityAnswers;
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

        component = new KoQuestionTwoComponent(mockedFormBuilder, mockedStore, mockedNavigationService);
        TestBed.configureTestingModule({
            declarations: [KoQuestionTwoComponent, KoQuestionsListsComponent, PageImageTitleComponent],
            imports: [BrowserAnimationsModule,TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, VertiMaterialModule],
            providers: [
                { provide: Store, useValue: mockedStore },
                { provide: NavigationService, useValue: mockedNavigationService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KoQuestionTwoComponent);
        component = fixture.componentInstance;
        mockedStore = TestBed.get(Store);
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of({}));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have koQuestion method triggered', () => {
        fixture.autoDetectChanges();
        component.koQuestion();
        expect(component.koQuestion).toBeTruthy();
        fixture.detectChanges();
    });

    it('should unsubscribe from all subscriptions', () => {
        component.koQuestionTwo$ = new Subscription();
        expect(component.koQuestionTwo$.closed).toBe(false);
        component.ngOnDestroy();
        expect(component.koQuestionTwo$.closed).toBe(true);
    });
});
