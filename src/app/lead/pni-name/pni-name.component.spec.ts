import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { interval, of, Subscription, Observable } from 'rxjs';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { InputMaskDirective } from '@shared/directives/input-mask.directive';
import { NameInputDirective } from '@shared/directives/name-input.directive';
import { DateFormatter } from '@shared/formatters/date-formatter';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { UserFormComponent } from '@shared/user-form/user-form.component';
import { PostLeadAction, SavePNIData } from '@app/store/actions/lead.actions';
import { PNINameComponent } from './pni-name.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

// tslint:disable-next-line:no-big-function
describe('PNINameComponent', () => {
    const translations: any = { screenTitle: { pni: 'This is a test' } };

    class FakeLoader implements TranslateLoader {
        getTranslation(lang: string): Observable<any> {
            return of(translations);
        }
    }
    let fakeLead;
    let testFormattedDOBStr;
    let testParsedDOB;

    let testFormInput;

    const dateFormatter = new DateFormatter();

    beforeEach(() => {
        testFormattedDOBStr = dateFormatter.format('03201980');
        testParsedDOB = {
            month: 3,
            day: 20,
            year: 1980
        };

        fakeLead = {
            firstName: 'testFirst',
            lastName: 'testLast',
            genderCode: 'M',
            dateOfBirth: { ...testParsedDOB },
            quote: {
                quoteNumber: true
            }
        };

        testFormInput = {
            firstName: 'Firstname',
            lastName: 'Fastname',
            DOB: testFormattedDOBStr,
            genderCode: 'M'
        };
    });

    describe('unit test', () => {
        let component: PNINameComponent;

        let formBuilder: FormBuilder;
        let mockedStore;
        let mockedNavigationService;
        let mockedDataLayerService;

        beforeEach(() => {
            formBuilder = new FormBuilder();
            mockedStore = {};
            mockedNavigationService = {};
            mockedDataLayerService = {};

            component = new PNINameComponent(
                formBuilder,
                dateFormatter,
                mockedStore,
                mockedNavigationService,
                mockedDataLayerService
            );
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should build a form with empty defaults if no lead is found in the store', () => {
            mockedStore.select = jasmine.createSpy('select').and.returnValue(of());

            expect(component.profileForm).toBeFalsy();

            component.ngOnInit();

            expect(component.profileForm).toBeTruthy();

            const controls = component.profileForm.controls;
            expect(controls.firstName && controls.lastName && controls.DOB && controls.genderCode).toBeTruthy();
            expect(
                controls.firstName.value || controls.lastName.value || controls.DOB.value || controls.genderCode.value
            ).toBeFalsy();
            expect(component.disableInput).toBeFalsy();
        });

        it('should populate form fields if lead information is found from store', () => {
            mockedStore.select = jasmine.createSpy('select').and.returnValue(of(fakeLead));

            expect(component.profileForm).toBeFalsy();

            component.ngOnInit();

            expect(component.profileForm).toBeTruthy();

            const controls = component.profileForm.controls;
            expect(controls.firstName && controls.lastName && controls.DOB && controls.genderCode).toBeTruthy();
            expect(
                controls.firstName.value === fakeLead.firstName &&
                    controls.lastName.value === fakeLead.lastName &&
                    controls.DOB.value === testFormattedDOBStr &&
                    controls.genderCode.value === fakeLead.genderCode
            ).toBe(true);
            expect(component.disableInput).toBe(fakeLead.quote.quoteNumber);
        });

        it('should update marketing data after view init', () => {
            mockedNavigationService.upDateMarketingData = jasmine.createSpy('upDateMarketingData');

            component.ngAfterViewInit();

            expect(mockedNavigationService.upDateMarketingData).toHaveBeenCalled();
        });

        it('should map gender codes to correct gender values', () => {
            expect(component.genderOptions.M).toEqual('Male');
            expect(component.genderOptions.F).toEqual('Female');
        });

        it('should extract PNI data from form data', () => {
            const expectedOutput = {
                firstName: testFormInput.firstName,
                lastName: testFormInput.lastName,
                dateOfBirth: testParsedDOB,
                genderValue: component.genderOptions[testFormInput.genderCode],
                genderCode: testFormInput.genderCode
            };

            const result = component.getPNIDataObjectFromFormData(testFormInput);

            expect(result).toEqual(expectedOutput);
        });

        it('should save new form data and post result, but continue to load when store says page is loading', fakeAsync(() => {
            const updatedForm = component.getPNIDataObjectFromFormData(testFormInput);
            const updatedForm2 = { ...updatedForm, firstName: 'number 2' };

            mockedStore.dispatch = jasmine.createSpy('dispatch');
            mockedStore.select = jasmine.createSpy('select').and.returnValues(of(updatedForm, updatedForm2), of(true));
            mockedNavigationService.navigate = jasmine.createSpy('navigate');
            mockedDataLayerService.pushToDataLayer = jasmine.createSpy('pushToDataLayer');

            component.saveDetails(testFormInput);

            expect(mockedStore.dispatch).toHaveBeenCalledTimes(2);
            expect(mockedStore.dispatch).toHaveBeenCalledWith(new SavePNIData(updatedForm));
            expect(mockedStore.dispatch).toHaveBeenCalledWith(new PostLeadAction(updatedForm));

            expect(mockedDataLayerService.pushToDataLayer).toHaveBeenCalledTimes(1);
            expect(component.leadSub.closed).toBeTruthy();
            expect(component.loaderStopped).toBe(false);
            expect(mockedNavigationService.navigate).not.toHaveBeenCalled();
        }));

        it('should save new form data and post result, and navigate to new page if load is finished', fakeAsync(() => {
            const updatedForm = component.getPNIDataObjectFromFormData(testFormInput);

            mockedStore.dispatch = jasmine.createSpy('dispatch');
            mockedStore.select = jasmine.createSpy('select').and.returnValues(interval(10000), of(false));
            mockedNavigationService.navigate = jasmine.createSpy('navigate');
            mockedDataLayerService.pushToDataLayer = jasmine.createSpy('pushToDataLayer');

            component.saveDetails(testFormInput);

            expect(mockedStore.dispatch).toHaveBeenCalledTimes(1);
            expect(mockedStore.dispatch).toHaveBeenCalledWith(new SavePNIData(updatedForm));

            expect(component.leadSub.closed).toBeTruthy();
            expect(component.loaderStopped).toBe(true);
            expect(mockedNavigationService.navigate).toHaveBeenCalledTimes(1);
            expect(mockedDataLayerService.pushToDataLayer).toHaveBeenCalledTimes(1);
        }));

        it('should unsubscribe from subscriptions on delete', () => {
            component.profileForm$ = new Subscription();
            component.loaderSubscription = new Subscription();
            component.leadSub = new Subscription();

            expect(component.profileForm$.closed).toBeFalsy();
            expect(component.loaderSubscription.closed).toBeFalsy();
            expect(component.leadSub.closed).toBeFalsy();

            component.ngOnDestroy();

            expect(component.profileForm$.closed).toBeTruthy();
            expect(component.loaderSubscription.closed).toBeTruthy();
            expect(component.leadSub.closed).toBeTruthy();
        });
    });

    // tslint:disable-next-line:no-big-function
    describe('integrated test', () => {
        let component: PNINameComponent;
        let fixture: ComponentFixture<PNINameComponent>;
        let de: DebugElement;
        let el: any;

        let mockedStore;
        let mockedNavigationService;
        let mockedDataLayerService;
        let translate: TranslateService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    PNINameComponent,
                    PageImageTitleComponent,
                    UserFormComponent,
                    NameInputDirective,
                    InputMaskDirective
                ],
                imports: [
                    BrowserAnimationsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    FlexLayoutModule,
                    MatInputModule,
                    MatFormFieldModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatCardModule,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: FakeLoader }
                    })
                ],
                providers: [
                    DateFormatter,
                    { provide: Store, useValue: {} },
                    {
                        provide: NavigationService,
                        useValue: {
                            upDateMarketingData: jasmine.createSpy('upDateMarketingData')
                        }
                    },
                    {
                        provide: DataLayerService,
                        useValue: {
                            pushToDataLayer: jasmine.createSpy('pushToDataLayer'),
                            pushStepTotal: jasmine.createSpy('pushStepTotal')
                        }
                    }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PNINameComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            translate = TestBed.get(TranslateService);

            mockedNavigationService = TestBed.get(NavigationService);
            mockedDataLayerService = TestBed.get(DataLayerService);
            mockedStore = TestBed.get(Store);
        });

        describe('no initial data', () => {
            beforeEach(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                fixture.detectChanges();
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });

            it('should have welcome message', () => {
                translate.use('en');
                fixture.detectChanges();
                expect(el.innerHTML).toContain('This is a test');
            });

            it('should contain waving image', () => {
                const imageEl = de.query(By.css('img')).nativeElement;
                expect(imageEl.src).toContain('img/Icon_HandWave.svg');
            });

            it('should contain form elements with no initial values', () => {
                const firstNameInput = de.query(By.css(`[formcontrolname=firstName]`)).nativeElement;
                const lastNameInput = de.query(By.css(`[formcontrolname=lastName]`)).nativeElement;
                const dobInput = de.query(By.css(`[formcontrolname=DOB]`)).nativeElement;
                const genderCodeToggle = de.query(By.css(`[formcontrolname=genderCode]`)).nativeElement;

                const inputs = de.queryAll(By.css('[formcontrolname]'));

                expect(inputs.length).toEqual(4, `there should be 4 input elements`);
                expect(firstNameInput && lastNameInput && genderCodeToggle && dobInput).toBeTruthy(
                    'expected input elements should be present'
                );
                expect(firstNameInput.value || lastNameInput.value || dobInput.value).toBeFalsy();
                expect(genderCodeToggle.innerHTML).not.toContain('mat-button-toggle-checked');
            });

            it('should contain disabled next button', () => {
                const buttonEl = de.query(By.css('form > button')).nativeElement;

                expect(buttonEl).toBeTruthy();
                expect(buttonEl.disabled).toBeTruthy();
            });
        });

        // tslint:disable-next-line:no-big-function
        describe('with initial data', () => {
            beforeEach(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(fakeLead));
            });

            it('should load form inputs with data from store', () => {
                fixture.detectChanges();

                const firstNameInput = de.query(By.css('[formcontrolname=firstName]')).nativeElement;
                const lastNameInput = de.query(By.css('[formcontrolname=lastName]')).nativeElement;
                const dobInput = de.query(By.css('[formcontrolname=DOB]')).nativeElement;
                const genderCodeToggle = de
                    .query(By.css('[formcontrolname=genderCode]'))
                    .query(By.css(`[value=${fakeLead.genderCode}]`)).nativeElement;

                const inputs = de.queryAll(By.css('[formcontrolname]'));

                expect(inputs.length).toEqual(4, `there should be 4 input elements`);
                expect(firstNameInput && lastNameInput && genderCodeToggle && dobInput).toBeTruthy(
                    'expected input elements should be present'
                );

                expect(firstNameInput.value).toEqual(fakeLead.firstName);
                expect(lastNameInput.value).toEqual(fakeLead.lastName);
                expect(dobInput.value).toEqual(testFormattedDOBStr);
                expect(genderCodeToggle.classList).toContain('mat-button-toggle-checked');
            });

            it('should have an invalid form when no first name is provided', () => {
                delete fakeLead.firstName;
                fixture.detectChanges();
                const buttonEl = de.query(By.css('form > button')).nativeElement;

                expect(buttonEl.disabled).toBe(true);
            });

            it('should have an invalid form when no last name is provided', () => {
                delete fakeLead.lastName;
                fixture.detectChanges();
                const buttonEl = de.query(By.css('form > button')).nativeElement;

                expect(buttonEl.disabled).toBe(true);
            });

            it('should have an invalid form when no gender code is provided', () => {
                delete fakeLead.genderCode;
                fixture.detectChanges();
                const buttonEl = de.query(By.css('form > button')).nativeElement;

                expect(buttonEl.disabled).toBe(true);
            });

            describe('DOB', () => {
                it('should have an invalid form when no DOB is provided', () => {
                    delete fakeLead.dateOfBirth;
                    fixture.detectChanges();

                    const dobInput = de.query(By.css(`[formcontrolname=DOB]`)).nativeElement;
                    dobInput.dispatchEvent(new Event('blur'));

                    fixture.detectChanges();

                    const buttonEl = de.query(By.css('form > button')).nativeElement;

                    expect(buttonEl.disabled).toBe(true);
                });

                it('should have an invalid form when DOB out of range when birth year is under 1900 (with message)', () => {
                    fakeLead.dateOfBirth.year = 1899;
                    fixture.detectChanges();

                    const dobInput = de.query(By.css(`[formcontrolname=DOB]`)).nativeElement;
                    dobInput.dispatchEvent(new Event('blur'));

                    fixture.detectChanges();

                    const buttonEl = de.query(By.css('form > button')).nativeElement;

                    expect(buttonEl.disabled).toBe(true);
                    expect(el.innerText).toContain('Please enter your full 4 digit birth year');
                });

                it('should have a valid form when DOB is valid and year is 1900 (no message)', () => {
                    fakeLead.dateOfBirth.year = 1900;
                    fixture.detectChanges();

                    const dobInput = de.query(By.css(`[formcontrolname=DOB]`)).nativeElement;
                    dobInput.dispatchEvent(new Event('blur'));

                    fixture.detectChanges();

                    const buttonEl = de.query(By.css('form > button')).nativeElement;

                    expect(buttonEl.disabled).toBe(false);
                    expect(el.innerText).not.toContain('Please enter your full 4 digit birth year');
                });

                it('should have an invalid form when DOB is after current date (with message)', () => {
                    const today = new Date();
                    fakeLead.dateOfBirth.month = today.getMonth() + 1;
                    fakeLead.dateOfBirth.day = today.getDate() + 1;
                    fakeLead.dateOfBirth.year = today.getFullYear();

                    fixture.detectChanges();

                    const dobInput = de.query(By.css(`[formcontrolname=DOB]`)).nativeElement;
                    dobInput.dispatchEvent(new Event('blur'));

                    fixture.detectChanges();

                    const buttonEl = de.query(By.css('form > button')).nativeElement;

                    expect(buttonEl.disabled).toBe(true);
                    // expect(el.innerText).toContain(
                    //     'Please enter your full 4 digit birth year'
                    // );
                });

                it('should have a valid form when DOB is current date (no message)', () => {
                    const today = new Date();
                    fakeLead.dateOfBirth.month = today.getMonth() + 1;
                    fakeLead.dateOfBirth.day = today.getDate();
                    fakeLead.dateOfBirth.year = today.getFullYear();

                    fixture.detectChanges();

                    const dobInput = de.query(By.css(`[formcontrolname=DOB]`)).nativeElement;
                    dobInput.dispatchEvent(new Event('blur'));

                    fixture.detectChanges();

                    const buttonEl = de.query(By.css('form > button')).nativeElement;

                    expect(buttonEl.disabled).toBe(false);
                    expect(el.innerText).not.toContain('Please enter your full 4 digit birth year');
                });
            });

            it('should enable button when all fields are valid', () => {
                fixture.detectChanges();
                const buttonEl = de.query(By.css('form > button')).nativeElement;

                expect(buttonEl.disabled).toBe(false);
            });

            // it(`should save details on 'next' button push`, fakeAsync(() => {
            //     fixture.detectChanges();
            //     const buttonEl = de.query(By.css('form > button')).nativeElement;

            //     component.saveDetails = jasmine.createSpy('saveDetails');
            //     expect(component.saveDetails).not.toHaveBeenCalled();
            //     buttonEl.click();
            //     expect(component.saveDetails).toHaveBeenCalledTimes(1);
            //     expect(component.saveDetails).toHaveBeenCalledWith(component.profileForm.value);
            // }));

            // it(`should have firstName, lastName, and DOB fields read only when isADPFQuote is true`, fakeAsync(() => {
            //     fixture.detectChanges();

            //     const firstNameInput = de.query(By.css('[formcontrolname=firstName]')).nativeElement;
            //     const lastNameInput = de.query(By.css('[formcontrolname=lastName]')).nativeElement;
            //     const dobInput = de.query(By.css('[formcontrolname=DOB]')).nativeElement;

            //     // expect(firstNameInput.getAttribute('ng-reflect-readonly')).toEqual('true');
            //     expect(lastNameInput.getAttribute('ng-reflect-readonly')).toEqual('true');
            //     expect(dobInput.getAttribute('ng-reflect-readonly')).toEqual('true');
            // }));

            // it(`should have firstName, lastName, and DOB fields edittable when isADPFQuote is false`, fakeAsync(() => {
            //     fakeLead.quote.isADPFQuote = false;
            //     fixture.detectChanges();

            //     const firstNameInput = de.query(By.css('[formcontrolname=firstName]')).nativeElement;
            //     const lastNameInput = de.query(By.css('[formcontrolname=lastName]')).nativeElement;
            //     const dobInput = de.query(By.css('[formcontrolname=DOB]')).nativeElement;

            //     expect(firstNameInput.getAttribute('ng-reflect-readonly')).toEqual('false');
            //     expect(lastNameInput.getAttribute('ng-reflect-readonly')).toEqual('false');
            //     expect(dobInput.getAttribute('ng-reflect-readonly')).toEqual('false');
            // }));
        });
    });
});
