import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { TypeListService } from '@services/type-list.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { MockTypeListService } from '@testing/mocks/services/type-list.service';
import { of, Subscription } from 'rxjs';
import { StartLoaderAction, StopLoaderAction } from 'src/app/store/actions/loader.actions';
import { LastTimeCarInsuranceComponent } from '../last-time-car-insurance/last-time-car-insurance.component';
import { TellUsBitMoreComponent } from '../tell-us-bit-more/tell-us-bit-more.component';
import { InsuranceCoverageComponent } from './insurance-coverage.component';
import { TranslateModule } from '@ngx-translate/core';




describe('InsuranceCoverageComponent', () => {
    let component: InsuranceCoverageComponent;
    let mockedTypeListService: MockTypeListService;
    let mockedStore;
    let mockedNavigationService;
    let testInsuranceCoverageOptions;
    let formBuilder: FormBuilder;
    let testYesValue;
    let testNoValue;
    let testFormData;
    let testFormData2;
    let currentInsuranceInfo, mockCustomQuote;
    let testQuoteObj;

    beforeEach(() => {
        mockedStore = {};
        mockedNavigationService = {};
        mockedTypeListService = new MockTypeListService();
        spyOn(mockedTypeListService, 'getYearsInsuredExtOptions').and.callThrough();
        spyOn(mockedTypeListService, 'getPriorPolicyLimitsExtOptions').and.callThrough();
        spyOn(mockedTypeListService, 'getLastActiveInsuranceExtOptions').and.callThrough();

        currentInsuranceInfo = {
            currentInsurance: 'true',
            lastActiveInsurance: 'lastActiveInsurance',
            yearsInsured: 'yearsInsured',
            bILimits: 'bILimits',
            bILimitsValue: 'bILimitsValue'
        };
        mockCustomQuote = {
            customQuote: {
                fullQuote: true,
                isCustom: true,
                isQuoteCustomized: true,
                quoteRated: true
            }
        };

        testInsuranceCoverageOptions = [
            {
                yesValue: 'true',
                noValue: 'false'
            }
        ];
        testYesValue = {
            coverage: testInsuranceCoverageOptions[0].yesValue
        };
        testNoValue = {
            coverage: testInsuranceCoverageOptions[0].noValue
        };
        testFormData = {
            selected: {
                coverage: testInsuranceCoverageOptions[0].yesValue
            },
            allOptions: testInsuranceCoverageOptions
        };
        testFormData2 = [
            { code: 'code1', description: 'description1' },
            { code: 'code2', description: 'description2' }
        ];
        testQuoteObj = {
            lead: {
                quote: { currentInsuranceInfo },
                nextPaymentDueDate: {
                    day: 22,
                    month: 10,
                    year: 2008
                }
            }
        };
    });

    describe('unit test', () => {
        let mockedDataLayerService;
        beforeEach(() => {
            mockedDataLayerService = {};

            formBuilder = new FormBuilder();
            component = new InsuranceCoverageComponent(
                formBuilder,
                mockedStore,
                mockedNavigationService,
                mockedTypeListService
            );
        });

        describe('ngOnInit', () => {
            it('should create a form with no default values and query store for lead status', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                component.ngOnInit();
                tick();
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new StartLoaderAction());
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new StopLoaderAction());
                const coverageControl = component.insuranceCoverageForm.get('coverage');
                expect(coverageControl.value).toBeFalsy('coverage status should not have a default value');
            }));
            xit(`should patch value with value found in store: 'Yes'`, fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testYesValue));
                component.ngOnInit();
                tick();
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new StartLoaderAction());
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new StopLoaderAction());
                component.insuranceCoverageForm.get('coverage').patchValue('true');
                const coverageControl = component.insuranceCoverageForm.get('coverage');
                expect(coverageControl.value).toEqual(testYesValue.coverage);
            }));
            it(`should patch value with value found in store: 'No'`, fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testNoValue));
                component.ngOnInit();
                tick();
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new StartLoaderAction());
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new StopLoaderAction());
                component.insuranceCoverageForm.get('coverage').patchValue('false');
                const coverageControl = component.insuranceCoverageForm.get('coverage');
                expect(coverageControl.value).toEqual(testNoValue.coverage);
            }));

            it('should have the correct title', () => {
                expect(component.title).toContain(`Do you have car insurance coverage currently?`);
            });
        });

        describe('ngOnDestroy', () => {
            it('should unsubscribe from all subscriptions', () => {
                component.insuranceCoverageForm$ = new Subscription();
                component.leadSub = new Subscription();
                component.loaderSubscription = new Subscription();

                expect(component.insuranceCoverageForm$.closed).toBe(false);
                expect(component.leadSub.closed).toBe(false);
                expect(component.loaderSubscription.closed).toBe(false);

                component.ngOnDestroy();

                expect(component.insuranceCoverageForm$.closed).toBe(true);
                expect(component.leadSub.closed).toBe(true);
                expect(component.loaderSubscription.closed).toBe(true);
            });
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<InsuranceCoverageComponent>;
        let de: DebugElement;
        let el: any;
        let mockOutputEventEmitter;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    InsuranceCoverageComponent,
                    PageImageTitleComponent,
                    TellUsBitMoreComponent,
                    LastTimeCarInsuranceComponent
                ],
                imports: [BrowserAnimationsModule, TranslateModule.forRoot(),FormsModule, ReactiveFormsModule, VertiMaterialModule],
                providers: [
                    { provide: Store, useValue: mockedStore },
                    { provide: NavigationService, useValue: mockedNavigationService },
                    { provide: TypeListService, useValue: mockedTypeListService }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InsuranceCoverageComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedStore = TestBed.get(Store);
            mockedTypeListService = TestBed.get(TypeListService);
            mockOutputEventEmitter = {
                optionSelected: jasmine.createSpy('optionSelected'),
                prefillInsuranceCoverage: jasmine.createSpy('prefillInsuranceCoverage')
            };
        });

        describe('no initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                mockedTypeListService.setTypeListOptions(testInsuranceCoverageOptions);

                fixture.autoDetectChanges();
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });

            it('should have the correct image', () => {
                const img = de.queryAll(By.css('img[src$="/manual_path_Icon.svg"]'));
                expect(img.length).toEqual(1);
            });

            it(`should have the correct toggle buttons with the correct values 'Yes' `, () => {
                for (const coverage of testInsuranceCoverageOptions) {
                    const buttonToggle = de.query(By.css(`mat-button-toggle[ng-reflect-value=${coverage.yesValue}]`));
                    expect(buttonToggle).toBeTruthy(`button toggle with value = ${coverage.yesValue} should exist`);
                }
            });
            it(`should have the correct toggle buttons with the correct values 'No' `, () => {
                for (const coverage of testInsuranceCoverageOptions) {
                    const buttonToggle = de.query(By.css(`mat-button-toggle[ng-reflect-value=${coverage.noValue}]`));
                    expect(buttonToggle).toBeTruthy(`button toggle with value = ${coverage.noValue} should exist`);
                }
            });

            it('should not have any buttons checked', () => {
                expect(de.query(By.css('.mat-button-toggle-checked'))).toBeFalsy();
            });
        });

        describe('with initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testYesValue));
                mockedTypeListService.setTypeListOptions(testInsuranceCoverageOptions);
                currentInsuranceInfo = {
                    currentInsurance: 'true',
                    lastActiveInsurance: 'lastActiveInsurance',
                    yearsInsured: 'yearsInsured',
                    bILimits: 'bILimits',
                    bILimitsValue: 'bILimitsValue'
                };
                mockedNavigationService.navigation = jasmine.createSpy('navigation');
            });

            it('should have initial button checked', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();

                expect(component.insuranceCoverageForm.controls.coverage).toBeTruthy();

                const checked = de.queryAll(
                    By.css(`mat-button-toggle[ng-reflect-value=${testInsuranceCoverageOptions[0].yesValue}]`)
                );
                expect(checked).toBeTruthy();
                expect(checked.length).toEqual(1);
                expect(checked[0].nativeElement.getAttribute('ng-reflect-value')).toEqual(testYesValue.coverage);
            }));

            it('should have toggle button clicked', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testYesValue));
                fixture.autoDetectChanges();
                tick();
                component.coverageToggle();
                el = fixture.debugElement.query(By.css(`mat-button-toggle`)).nativeElement;
                el.click();
                component.yesValue = true;
                component.noValue = false;
                expect(component.coverageToggle).toBeTruthy();
                expect(component.yesValue).toBeTruthy();
                expect(component.noValue).toBeFalsy();
            }));

            it('should have toggle function called', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.coverageToggle();
                el = fixture.debugElement.query(By.css(`mat-button-toggle`)).nativeElement;
                el.click();
                expect(component.coverageToggle).toBeTruthy();
                component.insuranceCoverageForm.get('coverage').patchValue(true);
                const coverageControl = component.insuranceCoverageForm.get('coverage');
                expect(coverageControl.value).toEqual(true);
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy(true);
                component.yesValue = false;
                component.noValue = true;
                expect(component.yesValue).toBeFalsy();
                expect(component.noValue).toBeTruthy();
                fixture.autoDetectChanges();
            }));

            it('should have toggle function called when user clicks Yes', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.insuranceCoverageForm.get('coverage').patchValue(true);
                const temp = true;
                component.coverageToggle(temp);
                expect(component.coverageToggle).toBeTruthy(true);
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy(true);
                component.yesValue = true;
                component.noValue = false;
                expect(component.yesValue).toBeTruthy();
                expect(component.noValue).toBeFalsy();
                fixture.autoDetectChanges();
            }));

            it('should have toggle function called when user clicks No', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.insuranceCoverageForm.get('coverage').patchValue(false);
                const temp = false;
                component.coverageToggle(temp);
                expect(component.coverageToggle).toBeTruthy();
                expect(component.insuranceCoverageForm.get('coverage').value).toBeFalsy(false);
                component.yesValue = false;
                component.noValue = true;
                expect(component.yesValue).toBeFalsy();
                expect(component.noValue).toBeTruthy();
                fixture.autoDetectChanges();
                expect(component.coverageToggle).toBeTruthy();
                component.coverageToggle(temp);
                expect(component.yesValue).toEqual(component.insuranceCoverageForm.get('coverage').value);
                expect(component.noValue).toEqual(true);
            }));

            it('should have toggle function called when user clicks No', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.insuranceCoverageForm.get('coverage').patchValue(true);
                const temp = undefined;
                component.coverageToggle(temp);
                expect(component.coverageToggle).toBeTruthy();
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy(true);
                component.yesValue = true;
                component.noValue = false;
                expect(component.yesValue).toBeTruthy();
                expect(component.noValue).toBeFalsy();
                fixture.autoDetectChanges();
            }));

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

            it('should have current Insurance Info form object is empty intialized', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                currentInsuranceInfo.currentInsurance = false;
                currentInsuranceInfo.lastActiveInsurance = '';
                currentInsuranceInfo.yearsInsured = '';
                currentInsuranceInfo.bILimits = '';
                currentInsuranceInfo.bILimitsValue = '';
                const formObj = { selected: currentInsuranceInfo };
                component.optionSelected(formObj);
                component.insuranceCoverageForm.get('coverage').patchValue(true);
                expect(component.optionSelected).toBeTruthy();
                expect(formObj.selected.currentInsurance).toBeFalsy();
                expect(formObj.selected.lastActiveInsurance).toBeFalsy();
                expect(formObj.selected.yearsInsured).toBeFalsy();
                expect(formObj.selected.bILimits).toBeFalsy();
                expect(formObj.selected.bILimitsValue).toBeFalsy();
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy();
                fixture.autoDetectChanges();
            }));

            it('should have coverage control value true, before optionSelected method triggered', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.insuranceCoverageForm.get('coverage').patchValue(true);
                const formObj = { selected: currentInsuranceInfo };
                component.optionSelected(formObj);
                expect(component.optionSelected).toBeTruthy();
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy();
                fixture.autoDetectChanges();
            }));

            it('should have empty values: yearsInsured, bILimits, bILimitsValue, when optionSelected method triggered', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                const currentInsuranceInfo1 = {
                    currentInsurance: 'false',
                    lastActiveInsurance: 'lastActiveInsurance',
                    yearsInsured: '',
                    bILimits: '',
                    bILimitsValue: ''
                };
                component.insuranceCoverageForm.get('coverage').patchValue(true);
                const newFormObj = { selected: currentInsuranceInfo1 };
                component.optionSelected(newFormObj);
                expect(component.optionSelected).toBeTruthy();
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy();
                fixture.autoDetectChanges();
                expect(newFormObj.selected.lastActiveInsurance).toBeTruthy();
                fixture.autoDetectChanges();
            }));

            it('should have prefillInsuranceCoverage method triggered and currentInsuranceInfo checking', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                const quote = { currentInsuranceInfo };
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(quote));
                fixture.autoDetectChanges();
                tick();
                component.prefillInsuranceCoverage();
                expect(component.prefillInsuranceCoverage).toBeTruthy();
                component.insuranceCoverageForm.get('coverage').patchValue(testYesValue);
                expect(component.insuranceCoverageForm.get('coverage').value).toBeTruthy();
                expect(testYesValue).toBeTruthy();
                component.coverageToggle(true);
                fixture.autoDetectChanges();
                tick();
                component.yearsInsuredExt = [
                    {
                        code: 'lesthan6months',
                        description: 'Less than 6 months'
                    },
                    {
                        code: '6monthsto1year',
                        description: '6 months to less than 1 year'
                    }
                ];
                component.selectedYearsInsuredValue = component.yearsInsuredExt.find(
                    item => item.code === 'lesthan6months'
                );
                component.selectedPriorPolicyLimitsValue = component.yearsInsuredExt.find(
                    item => item.code === '6monthsto1year'
                );
                component.selectedLapsePeriodExtValue = component.yearsInsuredExt.find(
                    item => item.code === 'lesthan6months'
                );
                fixture.autoDetectChanges();
                tick();
                expect(component.selectedYearsInsuredValue).toBeTruthy();
                expect(component.selectedPriorPolicyLimitsValue).toBeTruthy();
                expect(component.selectedLapsePeriodExtValue).toBeTruthy();
                fixture.autoDetectChanges();
                tick();
            }));

            it('should have prefillInsuranceCoverage method triggered', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockCustomQuote));
                fixture.autoDetectChanges();
                tick();
                component.prefillInsuranceCoverage();
                fixture.autoDetectChanges();
                tick();
                expect(component.prefillInsuranceCoverage).toBeTruthy();
                expect(component.isCustomQuoteAvailable).toEqual(true);
            }));
            it('should have prefillInsuranceCoverage method triggered', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockCustomQuote));
                fixture.autoDetectChanges();
                tick();
                const formObj = { selected: currentInsuranceInfo };
                component.prefillInsuranceCoverage();
                fixture.autoDetectChanges();
                tick();
                expect(component.prefillInsuranceCoverage).toBeTruthy();
                component.optionSelected(formObj);
                expect(component.optionSelected).toBeTruthy();
                expect(component.isCustomQuoteAvailable).toEqual(true);
                expect(component.currentInsurance).not.toEqual(component.insuranceCoverageForm.get('coverage').value);
            }));

            it('should have prefillInsuranceCoverage method triggered', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testQuoteObj));
                fixture.autoDetectChanges();
                tick();
                component.prefillInsuranceCoverage();
                expect(component.prefillInsuranceCoverage).toBeTruthy();
                const callToggle = testQuoteObj.lead.quote.currentInsuranceInfo.currentInsurance;
                expect(callToggle).toBeTruthy();
                fixture.autoDetectChanges();
                tick();
            }));
        });
    });
});
