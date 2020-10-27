import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { TitleHolderService } from '@services/title-holder.service';
import { ImageDescriptionGroupComponent } from '@shared/image-description-group/image-description-group.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { TitleHolderModalComponent } from '@shared/title-holder-modal/title-holder-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of, Subject } from 'rxjs';
import { WalmericDialogModalComponent } from 'src/app/core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { TitleHolder } from 'src/app/store/models/lead.model';
import { reducers } from 'src/app/store/reducers';
import { TitleHolderSelectComponent } from './title-holder-select.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TitleHolderSelectComponent', () => {
    let component: TitleHolderSelectComponent;
    let mockedStore;
    let mockedDialog;
    let mockedTitleHolderService;
    let mockedNavigationService;
    let formControl;
    let titleHoldercomponent;
    let testVehiclesList;
    let testTitleHolderOptions;
    let vehicles;
    let currentRouteObj;

    beforeEach(() => {
        mockedStore = {};
        mockedDialog = {};
        mockedNavigationService = {};
        testVehiclesList = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
        vehicles = [
            {
                vin: '1N6AD07W05C417494',
                fixedId: 207248,
                hasAfterMarketAlarm: true,
                hasExistingDamage: true,
                isADPFVehicle: false,
                isCommutingToNYNJ: false,
                isNewVehicle: false,
                primaryUseCode: 'pleasure',
                registeredCoOwner: 'None',
                registeredOwner: 'kavin kk',
                registeredStateCode: 'PA',
                statedValue: 18400,
                titleHolderCode: 'PaidFor',
                usedInRideSharing: false,
                bodyStyleCode: '',
                make: 'Nissan',
                model: 'Frontier',
                trim: '',
                year: 2005
            }
        ];
        // let titleHolderOptions: Array<TitleHolderOption> = [
        testTitleHolderOptions = [
            {
                type: TitleHolder.OWNED,
                name: 'I DO \u2014 (OWNED)'
            },
            {
                type: TitleHolder.LOAN,
                name: 'A BANK \u2014 (LOAN)'
            },
            {
                type: TitleHolder.LEASE,
                name: 'A DEALER \u2014 (LEASE)'
            },
            {
                type: TitleHolder.COMPANY,
                name: 'A COMPANY / FLEET'
            },
            {
                type: TitleHolder.TRUST,
                name: 'A TRUST'
            },
            {
                type: TitleHolder.UNKNOWN,
                name: `I DON'T KNOW`
            }
        ];
        mockedTitleHolderService = {
            vehicleObservable: jasmine.createSpy('vehicleObservable'),
            continue: jasmine.createSpy('continue')
        };
        mockedNavigationService = {
            upDateMarketingData: jasmine.createSpy('upDateMarketingData')
        };
        mockedTitleHolderService.vehicleObservable = of({ vehicles });
        currentRouteObj = { preFill: true };
        mockedNavigationService.currentRouteObj = currentRouteObj;
        mockedDialog = {
            open: jasmine.createSpy('open'),
            afterClosed: jasmine.createSpy('afterClosed')
        };
    });

    describe('unit test', () => {
        let mockedDataLayerService;
        beforeEach(() => {
            mockedDataLayerService = {};

            formControl = new FormControl();
            component = new TitleHolderSelectComponent(mockedDialog, mockedNavigationService, mockedTitleHolderService);
            titleHoldercomponent = component;
        });

        describe('ngOnInit', () => {
            it('should create a form with no default values', fakeAsync(() => {
                component.ngOnInit();
                tick();
                const coverageControl = component.selectControl;
                expect(coverageControl.value).toBeFalsy('coverage status should not have a default value');
            }));
            it(`should create a form with 'I DO (OWNED)' value `, fakeAsync(() => {
                component.ngOnInit();
                tick();
                component.selectControl.setValue('I DO (OWNED)');
                expect(component.selectControl.value).toBeTruthy();
            }));

            it('should create a form with set some values', fakeAsync(() => {
                component.ngOnInit();
                tick();
                component.vehicle = vehicles;
                component.vehicle.bodyStyleCode = 'SD';
                component.selectControl.setValue(TitleHolder.OWNED);
                expect(component.selectControl.value).toBeTruthy();
                tick();
                component.selectControl.setValue(TitleHolder.LEASE);
                expect(component.selectControl.value).toBeTruthy();
                tick();
            }));
            it('should have to set and check the isQuoteVehicle value', fakeAsync(() => {
                component.ngOnInit();
                tick();
                component.vehicle = vehicles;
                component.vehicle.isQuoteVehicle = true;
                component.selectControl.setValue(TitleHolder.OWNED);
                expect(component.vehicle.isQuoteVehicle).toBeTruthy();
                tick();
            }));

            it('should have to set and check the leaseOrRent value', fakeAsync(() => {
                component.ngOnInit();
                tick();
                component.vehicle = vehicles;
                component.vehicle.isQuoteVehicle = true;
                component.vehicle.leaseOrRent = true;
                component.selectControl.setValue(TitleHolder.LEASE);
                expect(component.vehicle.leaseOrRent).toBeTruthy();
                tick();
            }));
        });

        describe('ngOnDestroy', () => {
            let comp;
            it('should unsubscribe from all subscriptions', fakeAsync(() => {
                comp = titleHoldercomponent['ngDestroy$'];
                comp = new Subject();
                expect(comp.closed).toBe(false);
                component.ngOnDestroy();
                // tick();
                // expect(comp.closed).toBe(true);
            }));
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<TitleHolderSelectComponent>;
        let de: DebugElement;
        let el: any;
        // let mockOutputEventEmitter;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TitleHolderSelectComponent,
                    PageImageTitleComponent,
                    ImageDescriptionGroupComponent,
                    TitleHolderModalComponent,
                    WalmericDialogModalComponent
                ],
                imports: [
                    BrowserAnimationsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    VertiMaterialModule,
                    RouterTestingModule,
                    StoreModule.forRoot(reducers),
                    TranslateModule.forRoot()
                ],
                providers: [
                    { provide: Store, useValue: mockedStore },
                    { provide: NavigationService, useValue: mockedNavigationService },
                    { provide: TitleHolderService, useValue: mockedTitleHolderService },
                    { provide: MatDialog, useValue: mockedDialog }
                ],
                schemas: [NO_ERRORS_SCHEMA]
                // }).compileComponents();
            }).overrideModule(BrowserDynamicTestingModule, {
                set: { entryComponents: [] }
            });
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TitleHolderSelectComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            fixture.detectChanges();
        });

        describe('no initial data', () => {
            beforeEach(() => {
                fixture.autoDetectChanges();
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });

            it(`should have to set dynamic value into formcontrol (testTitleHolderOptions)`, fakeAsync(() => {
                for (const options of testTitleHolderOptions) {
                    component.selectControl.setValue(options);
                    expect(component.selectControl.value).toBeTruthy();
                    tick();
                }
            }));
        });

        describe('with initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
            });
            it('should have toggle button clicked', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.onButtonToggleClick(testTitleHolderOptions[0].type);
                el = fixture.debugElement.query(By.css(`mat-button-toggle`)).nativeElement;
                el.click();
                mockedTitleHolderService.continue(testTitleHolderOptions[0].type);
                expect(component.onButtonToggleClick).toBeTruthy();
                expect(mockedTitleHolderService.continue).toBeTruthy();
            }));

            it('should have openWalmericModal() clicked', fakeAsync(() => {
                fixture.autoDetectChanges();
                tick();
                component.openWalmericModal();
                expect(component.openWalmericModal).toBeTruthy();
                fixture.autoDetectChanges();
                tick();
            }));
        });
    });
});
