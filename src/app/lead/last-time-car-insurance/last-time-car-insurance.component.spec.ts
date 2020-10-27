import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { LastTimeCarInsuranceComponent } from './last-time-car-insurance.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TellUsBitMoreComponent } from '../tell-us-bit-more/tell-us-bit-more.component';
import { DebugElement } from '@angular/core';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('LastTimeCarInsuranceComponent', () => {
    let component: LastTimeCarInsuranceComponent;
    let mockedStore;
    let mockedNavigationService;
    let testInsuranceCoverageOptions;
    let formBuilder: FormBuilder;
    let test1;
    let test2;
    let testFormData;

    beforeEach(() => {
        mockedStore = {};
        mockedNavigationService = {};

        testInsuranceCoverageOptions = [
            {
                code: 'ineverhadalapse',
                description: 'I never had a lapse'
            },
            {
                code: 'morethan30daysago',
                description: 'More than 30 days ago'
            },
            {
                code: 'withinthelast30days',
                description: 'Within the last 30 days'
            }
        ];
        test1 = {
            carInsurance: testInsuranceCoverageOptions[0].code
        };
        test2 = {
            carInsurance: testInsuranceCoverageOptions[1].code
        };
        testFormData = {
            selected: {
                carInsurance: testInsuranceCoverageOptions[0].code
            },
            allOptions: testInsuranceCoverageOptions
        };
    });

    describe('unit test', () => {
        let mockedDataLayerService;

        beforeEach(() => {
            mockedDataLayerService = {};

            formBuilder = new FormBuilder();
            component = new LastTimeCarInsuranceComponent(formBuilder);
            component.selectedLapsePeriodExtValue = testInsuranceCoverageOptions;
            component.lapsePeriodExtOptions = testInsuranceCoverageOptions;
        });

        describe('ngOnInit', () => {
            it(`should patch value with value from parent component`, fakeAsync(() => {
                component.ngOnInit();
                tick();
                const coverageControl = component.carInsuranceForm.get('carInsurance');
                expect(coverageControl.value).not.toEqual(testInsuranceCoverageOptions[0]);
            }));
            it(`should patch value with value from parent component`, fakeAsync(() => {
                component.selectedLapsePeriodExtValue = testInsuranceCoverageOptions[0];
                component.ngOnInit();
                tick();
                const coverageControl = component.carInsuranceForm.get('carInsurance');
                expect(coverageControl.value).toEqual(testInsuranceCoverageOptions[0]);
            }));
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<LastTimeCarInsuranceComponent>;
        let de: DebugElement;
        let el: any;
        let mockBottonToggle;
        let currentInsuranceInfo;
        let mockOutputEventEmitter;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [LastTimeCarInsuranceComponent, PageImageTitleComponent, TellUsBitMoreComponent],
                imports: [BrowserAnimationsModule,TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, VertiMaterialModule],
                providers: [{ provide: Store, useValue: mockedStore }]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LastTimeCarInsuranceComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedStore = TestBed.get(Store);
            mockBottonToggle = {
                onButtonToggleClick: jasmine.createSpy('onButtonToggleClick'),
                optionSelected: jasmine.createSpy('optionSelected')
            };
            currentInsuranceInfo = {
                currentInsurance: 'true',
                lastActiveInsurance: 'lastActiveInsurance',
                yearsInsured: 'yearsInsured',
                bILimits: 'bILimits',
                bILimitsValue: 'bILimitsValue'
            };
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

            it('should have the correct title', () => {
                expect(el.innerText).toContain(`When was the last time you had car insurance?`);
            });

            it(`should have the correct toggle buttons with the correct values 'ineverhadalapse' `, () => {
                for (const coverage of testInsuranceCoverageOptions[0]) {
                    const buttonToggle = de.query(By.css(`mat-button-toggle[ng-reflect-value=${coverage.code}]`));
                    expect(buttonToggle).toBeTruthy(`button toggle with value = ${test1.code} should exist`);
                }
            });
            it(`should have the correct toggle buttons with the correct values 'morethan30daysago' `, () => {
                for (const coverage of testInsuranceCoverageOptions[1]) {
                    const buttonToggle = de.query(By.css(`mat-button-toggle[ng-reflect-value=${coverage.code}]`));
                    expect(buttonToggle).toBeTruthy(`button toggle with value = ${test2.code} should exist`);
                }
            });

            it('should not have any buttons checked', () => {
                expect(de.query(By.css('.mat-button-toggle-checked'))).toBeFalsy();
            });

            it('should call the form submitted', async () => {
                component.onSubmit();
                component.carInsuranceForm.get('carInsurance').setValue(testInsuranceCoverageOptions[0]);
                fixture.detectChanges();
                expect(component.onSubmit).toBeTruthy();
            });
        });

        describe('with initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(test1));
                mockOutputEventEmitter = {
                    optionSelected: jasmine.createSpy('optionSelected'),
                    onButtonToggleClick: jasmine.createSpy('onButtonToggleClick')
                };
            });

            it('should have optionSelected method triggered', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                const formObj = { selected: currentInsuranceInfo };
                component.optionSelected(formObj);
                expect(component.optionSelected).toBeTruthy();
                expect(formObj.selected.currentInsurance).toBeTruthy();
                expect(formObj.selected.lastActiveInsurance).toBeTruthy();
                expect(formObj.selected.yearsInsured).toBeTruthy();
                expect(formObj.selected.bILimits).toBeTruthy();
                expect(formObj.selected.bILimitsValue).toBeTruthy();
            }));

            it('should have toggle function called', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.carInsuranceForm.get('carInsurance').patchValue(testInsuranceCoverageOptions[0]);
                mockOutputEventEmitter.onButtonToggleClick();
                expect(mockOutputEventEmitter.onButtonToggleClick).toBeTruthy();
                const coverageControl = component.carInsuranceForm.get('carInsurance');
                component.show = true;
                expect(coverageControl.value).toEqual(testInsuranceCoverageOptions[0]);
                fixture.autoDetectChanges();
                tick();
            }));
        });
    });
});
