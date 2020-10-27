import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatCardModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as ErrorActions from '@app/store/actions/error.actions';
import { PostLeadAction, SavePNIData } from '@app/store/actions/lead.actions';
import { leadSelector } from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { TypeListService } from '@services/type-list.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { UserMaritalStatusComponent } from '@shared/user-marital-status/user-marital-status.component';
import { MockTypeListService } from '@testing/mocks/services/type-list.service';
import { interval, of, Subscription, throwError } from 'rxjs';
import { PniInfoComponent } from './pni-info.component';
import { TranslateModule } from '@ngx-translate/core';


// tslint:disable-next-line:no-big-function
describe('PniInfoComponent', () => {
    let component: PniInfoComponent;
    const fb = new FormBuilder();

    let mockedTypeListService: MockTypeListService;
    let mockedStore;
    let mockedNavigationService, typeListService;

    let testLead;
    let testFormData;
    let testMaritalStatusOptions;
    let getMaritalStatusOptions;

    beforeEach(() => {
        mockedStore = {};
        mockedNavigationService = {};
        typeListService = {};
        mockedTypeListService = new MockTypeListService();
        getMaritalStatusOptions = spyOn(mockedTypeListService, 'getMaritalStatusOptions').and.callThrough();

        testMaritalStatusOptions = [
            {
                code: 'code1',
                name: 'value1'
            },
            {
                code: 'code2',
                name: 'value2'
            },
            {
                code: 'code3',
                name: 'value3'
            }
        ];

        testLead = {
            maritalStatusCode: testMaritalStatusOptions[1].code
        };

        testFormData = {
            selected: {
                maritalStatusCode: testMaritalStatusOptions[1].code
            },
            allOptions: testMaritalStatusOptions
        };
    });

    describe('unit test', () => {
        let mockedDataLayerService;
        beforeEach(() => {
            mockedDataLayerService = {};
            component = new PniInfoComponent(
                fb,
                mockedStore,
                mockedNavigationService,
                mockedDataLayerService,
                mockedTypeListService
            );
            mockedStore.dispatch = jasmine.createSpy('dispatch');
        });

        describe('ngOnInit', () => {
            it('should create a form with no default values and query store for lead status', fakeAsync(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());

                component.ngOnInit();
                tick();

                const maritalControl = component.maritalStatusForm.get('maritalStatusCode');

                expect(maritalControl.value).toBeFalsy('marital status should not have a default value');
            }));

            it('should patch value with value found in store', fakeAsync(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testLead));

                component.ngOnInit();
                tick();

                const maritalControl = component.maritalStatusForm.get('maritalStatusCode');

                expect(maritalControl.value).toEqual(testLead.maritalStatusCode);
            }));
        });

        describe('ngAfterViewInit', () => {
            it('should update marketing data', () => {
                mockedNavigationService.upDateMarketingData = jasmine.createSpy('upDateMarketingData');

                expect(mockedNavigationService.upDateMarketingData).not.toHaveBeenCalled();

                component.ngAfterViewInit();

                expect(mockedNavigationService.upDateMarketingData).toHaveBeenCalled();
            });
        });

        describe('getMaritalStatusValue', () => {
            it('should get marital status value based off the selected code', () => {
                // test 1
                component.options = testMaritalStatusOptions;
                let result = component.getMaritalStatusValue(testFormData);

                expect(result).toEqual(testMaritalStatusOptions[1].name);

                // test 2
                testFormData.selected.maritalStatusCode = testMaritalStatusOptions[0].code;

                result = component.getMaritalStatusValue(testFormData);

                expect(result).toEqual(testMaritalStatusOptions[0].name);
            });

            it('should return an empty string if data is not provided', () => {
                expect(component.getMaritalStatusValue(null)).toEqual('');
                expect(component.getMaritalStatusValue({})).toEqual('');
            });
        });

        describe('onMaritalStatusChange', () => {
            it('should stop trying to post lead, and navigate to next page when loading is finished', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy().and.returnValues(interval(10000), of(false));
                expect(component.loaderStopped).toBeFalsy();
                component.onMaritalStatusChange(testFormData);
                tick();
                component.maritalStatusObj.maritalStatusValue = component.getMaritalStatusValue(testFormData);
                component.getMaritalStatusValue(testFormData);
                expect(component.maritalStatusObj).toEqual(testFormData.selected);
            }));
            it('should stop trying to post lead, and navigate to next page when loading is finished', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedDataLayerService.pushToDataLayer = jasmine.createSpy('pushToDataLayer');
                mockedStore.select = jasmine.createSpy().and.returnValues(interval(10000), of(false));
                mockedNavigationService.navigate = jasmine.createSpy('navigate');
                expect(component.loaderStopped).toBeFalsy();
                component.onMaritalStatusChange(testFormData);
                component.maritalStatusObj.maritalStatusValue = component.getMaritalStatusValue(testFormData);
                tick();
                component.saveAndNavigate();
                tick();
                expect(mockedStore.dispatch).toHaveBeenCalledWith(
                    new SavePNIData({ maritalStatusCode: 'code2', maritalStatusValue: '' })
                );
                expect(mockedStore.select).toHaveBeenCalledWith(leadSelector);
                expect(mockedNavigationService.navigate).toHaveBeenCalledTimes(1);
                expect(component.loaderStopped).toBe(true);
                expect(mockedDataLayerService.pushToDataLayer).toHaveBeenCalledTimes(1);
            }));
            it('should post the lead data', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedDataLayerService.pushToDataLayer = jasmine.createSpy('pushToDataLayer');
                mockedStore.select = jasmine
                    .createSpy()
                    .and.returnValues(of(testLead, { ...testLead, maritalStatusCode: 'fake' }), of());

                component.onMaritalStatusChange(testFormData);
                component.maritalStatusObj.maritalStatusValue = component.getMaritalStatusValue(testFormData);
                component.saveAndNavigate();
                tick();

                expect(mockedStore.dispatch).toHaveBeenCalledTimes(2);
                expect(mockedStore.dispatch).toHaveBeenCalledWith(
                    new SavePNIData({ maritalStatusCode: 'code2', maritalStatusValue: '' })
                );
                expect(mockedStore.dispatch).toHaveBeenCalledWith(new PostLeadAction(testLead));
                expect(mockedStore.select).toHaveBeenCalledWith(leadSelector);
                expect(component.loaderStopped).toBe(false);
                expect(mockedDataLayerService.pushToDataLayer).toHaveBeenCalledTimes(1);
            }));
        });

        describe('ngOnDestroy', () => {
            it('should unsubscribe from all subscriptions', () => {
                component.leadSub = new Subscription();
                component.maritalStatusForm$ = new Subscription();
                component.loaderSubscription = new Subscription();

                expect(component.leadSub.closed).toBe(false);
                expect(component.maritalStatusForm$.closed).toBe(false);
                expect(component.loaderSubscription.closed).toBe(false);

                component.ngOnDestroy();

                expect(component.leadSub.closed).toBe(true);
                expect(component.maritalStatusForm$.closed).toBe(true);
                expect(component.loaderSubscription.closed).toBe(true);
            });
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<PniInfoComponent>;
        let de: DebugElement;
        let el: any;
        let mockedDataLayerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [PniInfoComponent, PageImageTitleComponent, UserMaritalStatusComponent],
                imports: [
                    BrowserAnimationsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    MatButtonToggleModule,
                    MatCardModule,
                    TranslateModule.forRoot()
                ],
                providers: [
                    { provide: Store, useValue: mockedStore },
                    { provide: NavigationService, useValue: mockedNavigationService },
                    { provide: TypeListService, useValue: mockedTypeListService },
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
            fixture = TestBed.createComponent(PniInfoComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedStore = TestBed.get(Store);
            mockedNavigationService = TestBed.get(NavigationService);
            mockedDataLayerService = TestBed.get(DataLayerService);
            mockedTypeListService = TestBed.get(TypeListService);
        });

        describe('no initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                mockedNavigationService.upDateMarketingData = jasmine.createSpy('upDateMarketingData');
                mockedTypeListService.setTypeListOptions(testMaritalStatusOptions);

                fixture.autoDetectChanges();
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });

            it('should have the correct title', () => {
                expect(el.innerText).toContain(`What's your marital status?`);
            });

            it('should have the correct image', () => {
                const img = de.queryAll(By.css('img[src$="/Icon_MaritalStatus.svg"]'));
                expect(img.length).toEqual(1);
            });
        });

        describe('with initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(testLead));
                mockedNavigationService.upDateMarketingData = jasmine.createSpy('upDateMarketingData');
                mockedNavigationService.gotoRouteByName = jasmine.createSpy('gotoRouteByName');
                mockedTypeListService.setTypeListOptions(testMaritalStatusOptions);
            });

            it('should have initial button checked', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();

                expect(component.maritalStatusForm.controls.maritalStatusCode).toBeTruthy();

                const checked = de.queryAll(By.css('mat-button-toggle.mat-button-toggle-checked'));
                expect(checked).toBeTruthy();
                expect(checked.length).toEqual(1);
                expect(checked[0].nativeElement.getAttribute('ng-reflect-value')).toEqual(testLead.maritalStatusCode);
            }));
            it('should dispatch SetErrorAction for getMaritalStatusOptions service throws error ', () => {
                mockedTypeListService.getMaritalStatusOptions = jasmine
                    .createSpy('getMaritalStatusOptions')
                    .and.returnValue(throwError(''));
                component.ngOnInit();
                expect(mockedStore.dispatch).toHaveBeenCalled();
                expect(mockedStore.dispatch).toHaveBeenCalledWith(
                    new ErrorActions.SetErrorAction({
                        code: 600,
                        message: 'Service Failure/down'
                    })
                );
            });
        });
    });
});
