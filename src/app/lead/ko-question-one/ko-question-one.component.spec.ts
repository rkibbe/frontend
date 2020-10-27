import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { KoQuestionOneComponent } from './ko-question-one.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { Store } from '@ngrx/store';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { KoQuestionsListsComponent } from '@shared/ko-questions-lists/ko-questions-lists.component';
import { DebugElement } from '@angular/core';
import { NavigationService } from '@services/navigation.service';
import { of } from 'rxjs/internal/observable/of';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('KoQuestionOneComponent', () => {
    let component: KoQuestionOneComponent;
    let mockedStore;
    let mockedNavigationService;
    let formBuilder: FormBuilder;
    let testFormData, eligibilityAnswer;

    beforeEach(() => {
        mockedStore = {};
        testFormData = [
            {
                yes: 'yes',
                no: 'no'
            }
        ];
        eligibilityAnswer = {
            ineligibleVehicle: 'ineligibleVehicle',
            majorViolations: 'majorViolations',
            licenseRevoked: 'licenseRevoked'
        };
        mockedNavigationService = {
            upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
            saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
        };
    });

    describe('unit test', () => {
        beforeEach(() => {
            formBuilder = new FormBuilder();
            component = new KoQuestionOneComponent(formBuilder, mockedStore, mockedNavigationService);
        });

        describe('ngOnInit', () => {
            it('should create a form with no default values', fakeAsync(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                component.ngOnInit();
                tick();
                mockedNavigationService.upDateMarketingData();
                const coverageControl = component.koQuestionOne.get('ineligibleVehicle');
                expect(coverageControl.value).toBeFalsy('coverage status should not have a default value');
            }));

            it(`should patch value with value found in store: 'testFormData'`, fakeAsync(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(eligibilityAnswer));
                component.ngOnInit();
                tick();
                component.eligibilityAnswers = eligibilityAnswer;
                component.koQuestionOne.get('ineligibleVehicle').patchValue(testFormData);
                const coverageControl = component.koQuestionOne.get('ineligibleVehicle');
                expect(coverageControl.value).toEqual(testFormData);
            }));
        });

        describe('ngOnDestroy', () => {
            it('should unsubscribe from all subscriptions', () => {
                component.koQuestionOne$ = new Subscription();
                expect(component.koQuestionOne$.closed).toBe(false);
                component.ngOnDestroy();
                expect(component.koQuestionOne$.closed).toBe(true);
            });
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<KoQuestionOneComponent>;
        let de: DebugElement;
        let el: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [KoQuestionOneComponent, PageImageTitleComponent, KoQuestionsListsComponent],
                imports: [BrowserAnimationsModule,TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, VertiMaterialModule],
                providers: [
                    { provide: Store, useValue: mockedStore },
                    { provide: NavigationService, useValue: mockedNavigationService }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(KoQuestionOneComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedStore = TestBed.get(Store);
        });

        describe('no initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                fixture.autoDetectChanges();
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });
        });

        describe('with initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testFormData));
            });

            it('should have koQuestion method triggered', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.koQuestion();
                expect(component.koQuestion).toBeTruthy();
            }));
        });
    });
});
