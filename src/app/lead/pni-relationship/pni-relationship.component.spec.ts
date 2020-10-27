import { HttpClientModule } from '@angular/common/http';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatCardModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Driver } from '@app/store/models/lead.model';
import { Store } from '@ngrx/store';
import { DriverIconService } from '@services/driver-icon.service';
import { NavigationService } from '@services/navigation.service';
import { PniRelationshipService } from '@services/pni-relationship.service';
import { TypeListOption, TypeListService } from '@services/type-list.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { of, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { PniRelationshipComponent } from './pni-relationship.component';

// tslint:disable-next-line:no-big-function
describe('PniRelationshipComponent', () => {
    const IMAGE_NAME_1 = 'undefined-1';
    const IMAGE_NAME_2 = 'undefined-2';

    let component: PniRelationshipComponent;

    let mockedTypeListService;
    let mockedRelationshipService;
    let mockedNavigationService;
    let mockedStore;
    let mockedDriverIconService;

    let testDriverObservable: Subject<Driver>;

    beforeEach(done => {
        testDriverObservable = new Subject<Driver>();

        mockedTypeListService = {
            getRelationshipOptions: jasmine.createSpy('getRelationshipOptions')
        };
        mockedRelationshipService = {
            driverObservable: testDriverObservable,
            continue: jasmine.createSpy('continue')
        };
        mockedNavigationService = {
            currentRouteObj: { preFill: true },
            upDateMarketingData: jasmine.createSpy('upDateMarketingData')
        };
        mockedStore = {
            dispatch: jasmine.createSpy('dispatch')
        };
        mockedDriverIconService = {
            getDriverImageName: jasmine.createSpy('getDriverImageName')
        };

        done();
    });

    afterEach(done => {
        testDriverObservable.unsubscribe();
        done();
    });

    describe('unit test', () => {
        beforeEach(() => {
            component = new PniRelationshipComponent(
                mockedTypeListService as TypeListService,
                mockedRelationshipService as PniRelationshipService,
                mockedNavigationService as NavigationService,
                mockedStore as Store<any>,
                mockedDriverIconService as DriverIconService
            );
        });

        it('should continue to the next driver, providing relationship selected', () => {
            const selectedRelationship: TypeListOption = {
                code: 'CODE',
                description: 'DESCRIPTION'
            };

            expect(mockedRelationshipService.continue).not.toHaveBeenCalled();

            component.onButtonToggleClick(selectedRelationship);

            expect(mockedRelationshipService.continue).toHaveBeenCalledWith({
                relationshipCode: selectedRelationship.code,
                relationshipValue: selectedRelationship.description
            });
        });
    });

    // tslint:disable-next-line:no-big-function
    describe('integrated test', () => {
        let fixture: ComponentFixture<PniRelationshipComponent>;
        let de: DebugElement;
        let el: HTMLElement;

        let testDriver1: Driver;
        let testDriver2: Driver;

        const testRelationshipOptions: TypeListOption[] = [
            {
                code: 'code1',
                description: 'description1'
            },
            {
                code: 'code2',
                description: 'description2'
            },
            {
                code: 'code3',
                description: 'description3'
            }
        ];

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [PniRelationshipComponent],
                imports: [
                    BrowserAnimationsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    FlexLayoutModule,
                    MatButtonToggleModule,
                    MatCardModule,
                    HttpClientModule,
                    AngularSvgIconModule
                ],
                providers: [
                    {
                        provide: TypeListService,
                        useValue: mockedTypeListService
                    },
                    {
                        provide: NavigationService,
                        useValue: mockedNavigationService
                    },
                    {
                        provide: Store,
                        useValue: mockedStore
                    },
                    {
                        provide: DriverIconService,
                        useValue: mockedDriverIconService
                    }
                ],
                schemas: [NO_ERRORS_SCHEMA]
            })
                .overrideComponent(PniRelationshipComponent, {
                    set: {
                        providers: [
                            {
                                provide: PniRelationshipService,
                                useFactory: () => mockedRelationshipService
                            }
                        ]
                    }
                })
                .compileComponents();
        }));

        beforeEach(done => {
            fixture = TestBed.createComponent(PniRelationshipComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedTypeListService = TestBed.get(TypeListService);
            mockedRelationshipService = fixture.componentRef.injector.get(PniRelationshipService);
            mockedNavigationService = TestBed.get(NavigationService);
            mockedStore = TestBed.get(Store);
            mockedDriverIconService = TestBed.get(DriverIconService);

            testDriver1 = {
                driverID: '1',
                firstName: 'Dr1',
                lastName: 'Iver1'
            } as Driver;

            testDriver2 = {
                driverID: '2',
                firstName: 'Dr2',
                lastName: 'Iver2'
            } as Driver;

            mockedDriverIconService.getDriverImageName.and.returnValues(IMAGE_NAME_1, IMAGE_NAME_2);
            mockedRelationshipService.driverObservable = mockedRelationshipService.driverObservable.pipe(
                startWith(testDriver1)
            );
            mockedTypeListService.getRelationshipOptions.and.returnValue(of(testRelationshipOptions));

            done();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should update marketing data on initialization', () => {
            fixture.detectChanges();
            expect(mockedNavigationService.upDateMarketingData).toHaveBeenCalled();
        });

        it('should have the correct title with the provided driver', () => {
            fixture.detectChanges();

            expect(el.innerText).toContain(testDriver1.firstName);
            expect(el.innerText).toContain(testDriver1.lastName);
        });

        it('should have a toggle button for each type list options provided by service', () => {
            fixture.detectChanges();

            expect(mockedTypeListService.getRelationshipOptions).toHaveBeenCalled();

            const toggleButtons = getToggleButtons();

            expect(toggleButtons).toBeTruthy();
            expect(toggleButtons.length).toEqual(testRelationshipOptions.length);

            const descriptions = testRelationshipOptions.map(rel => rel.description);

            toggleButtons.forEach(toggleButton => {
                expect(descriptions).toContain(getToggleButtonInnerText(toggleButton));
            });
        });

        it('should show the correct driver icon', done => {
            fixture.detectChanges();

            const iconSrc = getSvgSrc();

            expect(iconSrc).toContain(IMAGE_NAME_1);
            done();
        });

        it('should not have a default value when driver has no relationship status', done => {
            fixture.detectChanges();

            expect(getSelectedToggleButtons().length).toBeFalsy();
            done();
        });

        it('should not have a default value when driver has a relationship, but route "preFill" is false', done => {
            testDriver1.relationshipCode = testRelationshipOptions[0].code;
            testDriver1.relationshipValue = testRelationshipOptions[0].description;

            mockedNavigationService.currentRouteObj.preFill = false;

            fixture.detectChanges();

            expect(getSelectedToggleButtons().length).toBeFalsy();
            done();
        });

        it('should have a default value when driver provides one, is a quote driver, and route can preFill', done => {
            testDriver1.relationshipCode = testRelationshipOptions[0].code;
            testDriver1.relationshipValue = testRelationshipOptions[0].description;

            fixture.detectChanges();

            const selected = getSelectedToggleButtons();

            expect(selected.length).toBeTruthy();
            expect(selected.length).toEqual(1);
            expect(getToggleButtonInnerText(selected[0])).toEqual(testRelationshipOptions[0].description);
            done();
        });

        describe('change driver', () => {
            beforeEach(done => {
                testDriver1.relationshipCode = testRelationshipOptions[0].code;
                testDriver1.relationshipValue = testRelationshipOptions[0].description;

                fixture.detectChanges();
                done();
            });

            it(`should reset it's form`, done => {
                let selected = getSelectedToggleButtons();

                expect(selected).toBeTruthy();
                expect(selected.length).toEqual(1);
                expect(getToggleButtonInnerText(selected[0])).toEqual(testRelationshipOptions[0].description);

                testDriverObservable.next(testDriver2);

                fixture.detectChanges();

                selected = getSelectedToggleButtons();

                expect(selected.length).toBeFalsy();
                done();
            });

            it(`should change the driver's name`, done => {
                expect(el.innerText).toContain(testDriver1.firstName);
                expect(el.innerText).toContain(testDriver1.lastName);
                expect(el.innerText).not.toContain(testDriver2.firstName);
                expect(el.innerText).not.toContain(testDriver2.lastName);

                testDriverObservable.next(testDriver2);

                fixture.detectChanges();

                expect(el.innerText).not.toContain(testDriver1.firstName);
                expect(el.innerText).not.toContain(testDriver1.lastName);
                expect(el.innerText).toContain(testDriver2.firstName);
                expect(el.innerText).toContain(testDriver2.lastName);
                done();
            });

            it(`should change the driver's icon`, done => {
                let iconSrc = getSvgSrc();

                expect(iconSrc).toContain(IMAGE_NAME_1);
                expect(iconSrc).not.toContain(IMAGE_NAME_2);

                testDriverObservable.next(testDriver2);

                fixture.detectChanges();

                iconSrc = getSvgSrc();

                expect(iconSrc).not.toContain(IMAGE_NAME_1);
                expect(iconSrc).toContain(IMAGE_NAME_2);
                done();
            });
        });

        it('should continue to the next driver when a relationship option is selected', () => {
            fixture.autoDetectChanges();

            const toggleButton = findToggleButtonByInnerText(testRelationshipOptions[1].description);
            const toggleButtonEl = getToggleButtonsButtonElement(toggleButton);

            expect(mockedRelationshipService.continue).not.toHaveBeenCalled();

            toggleButtonEl.click();

            expect(mockedRelationshipService.continue).toHaveBeenCalled();
        });

        it('should pass a partial driver with the updated relationship when option is selected', () => {
            fixture.autoDetectChanges();

            const toggleButton = findToggleButtonByInnerText(testRelationshipOptions[1].description);
            const toggleButtonEl = getToggleButtonsButtonElement(toggleButton);

            expect(mockedRelationshipService.continue).not.toHaveBeenCalled();

            toggleButtonEl.click();

            expect(mockedRelationshipService.continue).toHaveBeenCalledWith({
                relationshipCode: testRelationshipOptions[1].code,
                relationshipValue: testRelationshipOptions[1].description
            });
        });

        // HELPER FUNCTIONS
        // SVG
        function getSvgSrc(): DebugElement {
            return de.query(By.css('svg-icon')).nativeElement.getAttribute('ng-reflect-src');
        }

        // TOGGLE BUTTONS
        function getToggleButtons(): DebugElement[] {
            return de.queryAll(By.css('mat-button-toggle'));
        }

        function getSelectedToggleButtons(): DebugElement[] {
            return de.queryAll(By.css('.mat-button-toggle-checked'));
        }

        function getToggleButtonInnerText(button: DebugElement): string {
            return button.query(By.css('.mat-button-toggle-label-content')).nativeElement.innerText.toLowerCase();
        }

        function findToggleButtonByInnerText(text: string) {
            return getToggleButtons().find(button => getToggleButtonInnerText(button) === text);
        }

        function getToggleButtonsButtonElement(button: DebugElement): HTMLElement {
            return button.query(By.css('mat-button-toggle > button')).nativeElement;
        }
    });
});
