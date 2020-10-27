import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Driver, LicenseStatus, LicenseYears } from '@app/store/models/lead.model';
import { Store, StoreModule } from '@ngrx/store';
import { LicenseInfoStateService } from '@services/license-info-state.service';
import { NavigationService } from '@services/navigation.service';
import { TypeListService } from '@services/type-list.service';
import { LicenseFormatter } from '@shared/formatters/license-formatter';
import { IncludedDriverModalComponent } from '@shared/included-driver-modal/included-driver-modal.component';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { SetErrorAction } from 'src/app/store/actions/error.actions';
import { LicenseInfoComponent } from './license-info.component';
import { TranslateModule } from '@ngx-translate/core';

// tslint:disable-next-line:no-big-function
describe('LicenseInfoComponent', () => {
    let component: LicenseInfoComponent;
    let fixture: ComponentFixture<LicenseInfoComponent>;
    let de: DebugElement;
    let el: any;
    let dialogSpy: jasmine.Spy;
    let mockedNavService, mockedLicenseInfoStateService;
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(false), close: null });
    const matDialogStub = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const TEST_DRIVER_PNI: Driver = {
        driverID: '1',
        firstName: 'first1',
        lastName: 'last1',
        isPNI: true
    } as Driver;
    const TEST_DRIVER: Driver = {
        driverID: '3',
        firstName: 'first3',
        lastName: 'last3',
        isPNI: false,
        licenseState: 'US',
        isQuoteDriver: true
    } as Driver;
    const TEST_DRIVER_WITH_LICE: Driver = {
        driverID: '3',
        firstName: 'first3',
        lastName: 'last3',
        isPNI: false,
        licenseState: 'US',
        isQuoteDriver: true,
        licenseNumber: '545455666',
        yearsLicensed: LicenseYears.OneToLessThanTwoYears,
        ownInsuranceApprovedExt: true,
        licenseStatusValue: LicenseStatus.NeverLicensed
    } as Driver;
    const TEST_DRIVER_WITH_LICE_FALSE: Driver = {
        driverID: '3',
        firstName: 'first3',
        lastName: 'last3',
        isPNI: true,
        licenseState: 'US',
        isQuoteDriver: true,
        licenseNumber: '545455666',
        yearsLicensed: LicenseYears.OneToLessThanTwoYears,
        ownInsuranceApprovedExt: false,
        licenseStatusValue: LicenseStatus.NeverLicensed
    } as Driver;

    const dialogRefStub = {
        afterClosed() {
            return of(true);
        }
    };
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of([TEST_DRIVER_PNI])),
        dispatch: jasmine.createSpy('disaptch')
    };
    const dialogStub = { open: () => dialogRefStub };
    const mockedTypelist = {
        getLicenseTypelistOptions: jasmine.createSpy('getLicenseTypelistOptions').and.returnValue(
            of({
                stateList: [{ code: 'string', description: 'string' }],
                statusList: [
                    {
                        code: LicenseStatus.NeverLicensed,
                        description: 'test des'
                    }
                ],
                yearList: [{ code: 'string', description: 'string' }]
            })
        )
    };
    const mockedNavigationService = {
        upDateMarketingData: jasmine.createSpy('updateMarketingData'),
        registerBackHandler: jasmine.createSpy('registerBackHandler'),
        navigate: jasmine.createSpy('navigate'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        timeoutThenRouteToSystemFailure: jasmine
            .createSpy('timeoutThenRouteToSystemFailure')
            .and.returnValue(obs$ => obs$),
        currentRouteObj: {
            content: [
                {
                    visible: true,
                    hasDependency: true,
                    required: true,
                    attribute: 'licenseNum',
                    value: ''
                },
                { visible: true, hasDependency: true, required: true, attribute: 'state', value: '' },
                {
                    visible: true,
                    hasDependency: false,
                    required: false,
                    attribute: 'licenseStatus',
                    value: ''
                },
                {
                    visible: true,
                    hasDependency: true,
                    required: true,
                    attribute: 'licenseYears',
                    value: ''
                }
            ]
        }
    };
    const formBuilder: FormBuilder = new FormBuilder();


    beforeEach(async(() => {
        mockedLicenseInfoStateService = {
            driverObservable: jasmine.createSpy('driverObservable').and.returnValue(of(TEST_DRIVER_PNI)),
            continue: jasmine.createSpy('continue')
        };
        TestBed.configureTestingModule({
            declarations: [LicenseInfoComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                SharedModule,
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
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: LicenseInfoStateService,
                    useValue: mockedLicenseInfoStateService
                },
                {
                    provide: LicenseFormatter,
                    useValue: {}
                },
                {
                    provide: TypeListService,
                    useValue: mockedTypelist
                },
                {
                    provide: NavigationService,
                    useValue: mockedNavigationService
                },

                {
                    provide: Store,
                    useValue: mockedStore
                },
                { provide: MatDialog, useValue: dialogStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LicenseInfoComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        mockedNavService = TestBed.get(NavigationService);
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    });
    it('should create', async () => {
        expect(component).toBeTruthy();
    });
    describe('OnInIt', () => {
        it('should call getLicenseTypelistOptions service ', async () => {
            component.ngOnInit();
            expect(component['typeListOptionsGathered']).toEqual(true);
        });
        it('should call getLicenseTypelistOptions service oninit', async () => {
            component.ngOnInit();
            expect(component['typeListOptionsGathered']).toEqual(true);
        });
        it('should call duplicateLicenseNumErrMsg oninit', async () => {
            component.ngOnInit();
            const spy = spyOnProperty(component, 'duplicateLicenseNumErrMsg').and.returnValue(
                'License number already used'
            );

            expect(spy()).toEqual('License number already used');
        });
        it('should option list empty if values not found in  getLicenseTypelistOptions service ', async () => {
            mockedTypelist.getLicenseTypelistOptions.and.returnValue(of({}));
            component.ngOnInit();
            expect(component.stateOptions).toEqual([]);
            expect(component.statusOptions).toEqual([]);
            expect(component.yearOptions).toEqual([]);
        });
        it('should set correct values for licenseInfoGroup', async () => {
            const navigation = TestBed.get(NavigationService);
            navigation.currentRouteObj = {
                content: [
                    {
                        visible: true,
                        hasDependency: true,
                        required: false,
                        attribute: 'licenseNum',
                        value: ''
                    },
                    {
                        visible: true,
                        hasDependency: true,
                        required: false,
                        attribute: '',
                        value: ''
                    },
                    { visible: true, hasDependency: false, required: true, attribute: 'state', value: '' }
                ]
            };
            component.ngOnInit();
        });
    });
    xit('should prefilledLicenseNumber value false for onLicenseNumBlur', async () => {
        component.driver = TEST_DRIVER_WITH_LICE;
        component['prefilledLicenseNumber'] = true;
        component.licenseInfoGroup.get('licenseNum').setValue('test');
        component.licenseNumControl.setValue('777677');
        component.onLicenseNumBlur();
    });
    it('should prefilledLicenseNumber value false for onLicenseNumInput', async () => {
        component.onLicenseNumInput();
        expect(component['prefilledLicenseNumber']).toEqual(false);
    });
    it('should licenseNumControl value empty if prefilledLicenseNumber  for licenseNumFoucs ', async () => {
        component.buildForm();
        component['prefilledLicenseNumber'] = true;
        component.onLicenseNumFocus();
        expect(component['licenseNumControl'].value).toEqual('');
    });
    it('should show IncludedDriverModalComponent modal', async () => {
        component.routeToSystemFailure();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
            new SetErrorAction({
                code: 600,
                message: 'Service Failure/down'
            })
        );
    });
    it('For new driver should have defult driver PA ', async () => {
        component.buildForm();
        component.resetForNewDriver(TEST_DRIVER_PNI);
        expect(component['prefilledLicenseNumber']).toEqual(false);
        expect(component['stateControl'].value).toEqual('PA');
    });
    it('should have correct license state for driver ', async () => {
        component.buildForm();
        component.resetForNewDriver(TEST_DRIVER);
        expect(component['prefilledLicenseNumber']).toEqual(false);
        expect(component['stateControl'].value).toEqual('US');
    });
    it('should license number and Year auto populate if found in driver', async () => {
        component.ngOnInit();
        component.resetForNewDriver(TEST_DRIVER_WITH_LICE);
        expect(component['prefilledLicenseNumber']).toEqual(true);
        expect(component['stateControl'].value).toEqual('US');
        expect(component['licenseYearsControl'].value).toEqual(LicenseYears.OneToLessThanTwoYears);
    });
    it('should show licesne num error mgs for updateLicenseNumberValidation', async () => {
        component.ngOnInit();
        component.updateLicenseNumberValidation();
        expect(component.showLicenseNumErrors).toEqual(true);
    });
    it('should show licesne num error mgs for updateLicenseNumberValidation', async () => {
        component.ngOnInit();
        component.updateLicenseNumberValidation();
        expect(component.showLicenseNumErrors).toEqual(true);
        spyOn(component, 'resetForNewDriver').and.callThrough();

        spyOn(component, 'setDefaultDriverFields').and.callThrough();
        component.setDefaultDriverFields(TEST_DRIVER);
        fixture.detectChanges();
    });

    it('should show ownInsuranceApprovedExt will be true', async () => {
        component.driver = TEST_DRIVER_WITH_LICE;
        component.ngOnInit();
        component.checkIfLicenseInfoShouldShow(LicenseStatus.OwnInsurance);
        component['licenseStatusControl'].setValue(LicenseStatus.OwnInsurance);
        spyOn(component, 'toggleLicenseInfoGroup').and.callThrough();
        spyOn(component, 'showInclusionModal').and.callThrough();
        component['licenseStatusControl'].markAsDirty();
        component.toggleLicenseInfoGroup(false);
        component.showInclusionModal();
        // expect(component['ownInsuranceApprovedExt']).toEqual(false);
    });

    it('should remove control licenseInfoGroup from form for NeverLicensed', async () => {
        component.driver = TEST_DRIVER_WITH_LICE;
        component.ngOnInit();
        component['licenseStatusControl'].markAsDirty();
        component.checkIfLicenseInfoShouldShow(LicenseStatus.NeverLicensed);
        expect(component.form.get('licenseInfoGroup')).toBeFalsy();
    });
    it('should have correct title based on drvier first name and last name ', async () => {
        component.driver = TEST_DRIVER_WITH_LICE;
        const result = component.title;
        expect(result).toEqual("first3 last3's driver's license info.");
    });
    it('should have correct licenseNumErrMsg based on state and drvier licenseState ', async () => {
        component.driver = TEST_DRIVER_WITH_LICE;
        component.buildForm();
        component.resetForNewDriver(TEST_DRIVER_PNI);
        const result = component.licenseNumErrMsg;
        expect(result).toEqual(`That's not a valid PA driver license number`);
    });

    it('should have correct duplicateLicenseNumErrMsg', async () => {
        const result = component.duplicateLicenseNumErrMsg;
        expect(result).toEqual('License number already used');
    });
    it('should have correct duplicateLicenseNumErrMsg', async () => {
        const result = component['licenseStatusControl'];
        expect(result).toEqual(null);
    });
    it('should open modal ', async () => {
        component.buildForm();
        component.resetForNewDriver(TEST_DRIVER_PNI);
        component['licenseStatusControl'].markAsDirty();
        component.checkIfLicenseInfoShouldShow(LicenseStatus.OwnInsurance);
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(IncludedDriverModalComponent, {
            panelClass: 'license-modal-panel',
            data: TEST_DRIVER_PNI
        });
    });
    it('should open modal ', async () => {
        component.buildForm();
        component.resetForNewDriver(TEST_DRIVER_PNI);
        component.toggleLicenseInfoGroup(true);
    });
    xit('should licenseNumControl markAsTouched on click of  updateLicenseNumberValidation ', async () => {
        component.buildForm();
        component.driver = TEST_DRIVER;
        component.licenseNumControl.setValue('test');
        component['stateControl'].markAsDirty();
        component.updateLicenseNumberValidation();
        // expect(component.licenseNumControl.markAsTouched()).toBeTruthy();
    });
    xit('should call continue method on click of onSubmit ', async () => {
        component.buildForm();

        component.driver = TEST_DRIVER_WITH_LICE;
        component['prefilledLicenseNumber'] = true;

        component.yearOptions = [{ code: 'string', description: 'string' }];
        component.stateOptions = [{ code: 'string', description: 'string' }];
        component.statusOptions = [{ code: 'string', description: LicenseStatus.NeverLicensed }];
        component['licenseNumControl'].setValue(LicenseStatus.NeverLicensed);

        component.onLicenseNumBlur();
        expect(component['licenseNumControl'].value).toEqual('545455666');
    });
    xit('licenseNumControl value change', async () => {
        component.ngOnInit();
        component.driver = TEST_DRIVER;
        TEST_DRIVER_PNI.isPNI = false;
        component.setDefaultDriverFields(TEST_DRIVER_PNI);
    });
    it('getStarredValue value change', async () => {
        component.ngOnInit();
        component.driver = TEST_DRIVER;
        TEST_DRIVER_PNI.isPNI = false;
        const result = component['getStarredValue']('tes');
        expect(result).toEqual('tes');
    });
    xit('getStarredValue value change', () => {
        component.ngOnInit();
        component['licenseStatusControl'].setValue(LicenseStatus.ValidLicense);
        component.yearOptions = [{ code: 'string', description: 'string' }];
        component.stateOptions = [{ code: 'string', description: 'string' }];
        component.statusOptions = [{ code: 'string', description: LicenseStatus.NeverLicensed }];
        component.driver = TEST_DRIVER;
        component.getCurrentFormInfo();
    });
});
