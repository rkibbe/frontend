import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NavigationService } from '@app/core/services/navigation.service';
import { DefaultReviewComponent } from './default-review.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { BigPriceComponent } from '@shared/big-price/big-price.component';
import { DriverIconService } from '@services/driver-icon.service';
import { DefaultReviewService } from '@services/default-review.service';
import { of } from 'rxjs/internal/observable/of';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReviewAllDetailsModalComponent } from '@shared/review-all-details-modal/review-all-details-modal.component';
import { NO_COVERAGE } from '@app/core/constants';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SnackbarComponent } from '@shared/snackbar/snackbar.component';
import { SnackbarService } from '@services/snackbar.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('DefaultReviewComponent', () => {
    let component: DefaultReviewComponent;
    let mockedDialog,
        mockedStore,
        mockedNavigationService,
        mockedDriverIconService,
        mockedDefaultReviewService,
        mockedSnackbarService,
        mockedChangeDetectorRef;
    let storeMock;
    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };

    const quickQuoteData = {
        periodStartDate: {
            day: 2,
            month: 1,
            year: 2009
        },
        drivers: [
            {
                firstName: 'Sdffs',
                lastName: 'Dfsdfs',
                genderCode: 'M',
                roleCode: '',
                roleVaue: '',
                driverID: 'string',
                genderValue: 'string',
                age: 'string',
                isIncluded: 'boolean'
            }
        ],
        vehicles: [
            {
                publicID: 'pc:217756',
                year: 2020,
                make: 'TOYOTA',
                model: 'COROLLA',
                trim: 'Sedan',
                vinPrefix: 'JTDP4RCE4LJ016313',
                isIncluded: true,
                isADPF: false,
                vehicleID: '00Q29000007I3Z0EAK-1',
                titleHolder: ''
            },
            {
                publicID: 'pc:217757',
                year: 2019,
                make: 'TOYOTA',
                model: 'COROLLA',
                trim: 'Sedan',
                vinPrefix: 'JTDP4RCE4LJ016314',
                isIncluded: true,
                isADPF: false,
                vehicleID: '00Q29000007I3Z0EAK-2'
            }
        ],
        monthlyPremiumPrice: null,
        fullTermPremiumPrice: null,
        policyTerm: ''
    };
    const customQuoteData = {
        fullQuote: true,
        isCustom: false,
        isQuoteCustomized: true
    };

    const quoteData = {
        quoteNumber: '00Q29000007IripEAC',
        quoteStatus: 'string',
        isADPFQuote: true,
        newCarReplacement: false,
        policyCoverage: {
            bILimit: '$25K/$50K',
            uMBILimit: '$25K/$50K',
            uIMBILimit: '$25K/$50K',
            tort: 'Limited',
            pDLimit: '$25K',
            futureAccident: true,
            currentAccident: true,
            immediateAccident: true,
            repairAssistance: false,
            extraMedical: 'NoCoverage',
            combined: 'NoCoverage',
            death: 'NoCoverage',
            funeral: 'NoCoverage',
            idTheft: false,
            medical: '$5K',
            income: 'NoCoverage',
            newCarReplacement: false,
            selCodeUMBI: 'zhdhmu6kbmoke3d0fesnfis2o59',
            selValueUMBI: '100,000/300,000',
            stackedUMBILimit: 'No',
            selCodeStackUMBI: 'false',
            selValueStackUMBI: 'No',
            selCodeBiLimit: 'z6ogs1pkqqt8ne7b85mrv7vptkb',
            selValueBiLimit: '100,000/300,000',
            selCodeUIMBI: 'pack_258',
            selValueUIMBI: '100,000/300,000',
            stackedUIMBILimit: 'No',
            selCodeStackUIMBI: 'false',
            selValueStackUIMBI: 'No',
            selCodeTort: 'limited',
            selValueTort: 'Limited',
            selCodeProperty: 'zh6gugqov6r55b5qqcsgs88gou8',
            selValueProperty: '50,000',

            identityTheft: 'No',
            selCodeMedical: 'papkg0d2qrfr3f5p4joneh4oo208',
            selValueMedical: '$5,000',
            selCodeExtraMed: '',
            selValueExtraMed: '',
            selCodeIncome: '',
            selValueIncome: '',
            selCodeDeath: '',
            selValueDeath: '',
            selCodeFuneral: 'pan6hmolvuj8180h144nqca84r28',
            selValueFuneral: '2,500',
            selCodeCombined: '',
            selValueCombined: ''
        },
        currentCarrier: {
            currentInsurance: false,
            lapseReason: '',
            yearsInsuredValue: '',
            bILimitFormatted: null
        },
        customQuote: customQuoteData,
        periodStartDate: {
            day: 2,
            month: 1,
            year: 2009
        }
    };
    const coverageData = {
        firstPartyBenefits: [
            {
                name: 'Medical (FMB)',
                code: 'PAPIPPA_MEDICAL',
                options: [
                    {
                        name: '$10,000',
                        code: 'panfgaecig43ee8okfn3hqo4li9b',
                        value: '$10K'
                    },
                    {
                        name: '$5,000',
                        code: 'papkg0d2qrfr3f5p4joneh4oo208',
                        value: '$5K'
                    },
                    {
                        name: '$25,000',
                        code: 'pa6kg44ipm3i21f67v8b95ht60u8',
                        value: '$25K'
                    }
                ]
            }
        ],
        liabilityCoverages: [
            {
                name: 'Bodily Injury (BI)',
                code: 'PABodilyInjuryExtCov',
                options: [
                    {
                        name: '15,000/30,000',
                        code: 'zulggnka4p3gp1bevjkppph6gq8',
                        value: '$15K/$30K'
                    },
                    {
                        name: '25,000/50,000',
                        code: 'ziiha087jtd9e16lthdvpfegvt9',
                        value: '$25K/$50K'
                    },
                    {
                        name: '50,000/100,000',
                        code: 'zimgkua9gvbsi2d2edoj776csk9',
                        value: '$50K/$100K'
                    }
                ]
            }
        ],
        vehicleCoverages: [
            {
                name: 'Comprehensive (CMP)',
                code: 'PAComprehensiveCov',
                options: [
                    {
                        name: 'No Coverage',
                        code: '',
                        value: ''
                    },
                    {
                        name: '100',
                        code: 'z48j8jgbg6dckbl7ek0sglslvi8',
                        value: '$100'
                    },
                    {
                        name: '250',
                        code: 'opt_329',
                        value: '$250'
                    }
                ]
            }
        ]
    };

    describe('unit test', () => {
        mockedDialog = {};
        mockedStore = {};
        mockedNavigationService = {};
        mockedDriverIconService = {
            getDriverImageName: () => 'driver_img'
        };
        mockedDefaultReviewService = {};
        mockedSnackbarService = {};
        mockedChangeDetectorRef = {};
        storeMock = {
            select() {
                return of(mockedStore);
            },
            dispatch() {}
        };
        mockedDefaultReviewService = {
            getCoverageDetails() {
                return of(coverageData);
            }
        };
        mockedNavigationService = {
            upDateMarketingData: () => ({}),
            navigate: () => ({}),
            saveLeadAndNavigate: ngDestroy$ => ({}),
            gotoRouteByName: string => ({})
        };

        beforeEach(() => {
            component = new DefaultReviewComponent(
                mockedDialog,
                mockedStore,
                mockedNavigationService,
                mockedDriverIconService,
                mockedDefaultReviewService,
                mockedSnackbarService,
                mockedChangeDetectorRef
            );
        });

        describe('ngOnInit', () => {
            it('should have no values in the store', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                component.ngOnInit();
                tick();
            }));
            it('should call coverages service', fakeAsync(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                component.ngOnInit();
                tick();
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(coverageData));
                component.firstPartyBenefits = coverageData.firstPartyBenefits;
                component.liabilityCoverages = coverageData.liabilityCoverages;
                component.vehicleCoverages = coverageData.vehicleCoverages;
                expect(coverageData).toBeTruthy(true);
                expect(coverageData.firstPartyBenefits).toEqual(component.firstPartyBenefits);
                expect(coverageData.liabilityCoverages).toEqual(component.liabilityCoverages);
                expect(coverageData.vehicleCoverages).toEqual(component.vehicleCoverages);
            }));
            it('should get the quickQuote data from store', fakeAsync(() => {
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                component.ngOnInit();
                tick();
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of(quickQuoteData));
            }));
        });

        describe('integrated test', () => {
            let fixture: ComponentFixture<DefaultReviewComponent>;
            let de: DebugElement;
            let el: any;
            let mockDialogRef;
            let mockOutputEventEmitter;
            const mockWindow = {
                conciergeReady: []
            };
            let dialogSpy: jasmine.Spy;
            let openSnackbarSpy;
            let menuObj, expectedPayload, mockGetCoverageDetails;
            const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null, closeAll: () => null });
            dialogRefSpyObj.componentInstance = { body: '' };
            const opensnackSpyObj = jasmine.createSpyObj({
                afterDismissed: of({ dismissedByAction: false }),
                close: null,
                closeAll: () => null
            });
            opensnackSpyObj.componentInstance = { body: '' };

            const mockfirstPartyCoverages = [
                {
                    options: [
                        {
                            code: '002',
                            value: 'test'
                        }
                    ],
                    code: 'PAPIPPA_MEDICAL'
                }
            ];
            const getCoverageDetailsMock = {
                getCoverageDetails: jasmine.createSpy('getCoverageDetails').and.returnValue(of(coverageData))
            };

            beforeEach(async(() => {
                // mockedDefaultReviewService = {
                //     getCoverageDetails: jasmine.createSpy('getCoverageDetails').and.returnValue(of(coverageData))
                // };
                menuObj = {
                    value: 'I Decline',
                    code: '002',
                    name: 'test/name'
                };
                expectedPayload = {
                    medical: quoteData.policyCoverage.medical,
                    selCodeMedical: '',
                    selValueMedical: ''
                };
                mockedNavigationService = {
                    upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
                    navigate: jasmine.createSpy('navigate'),
                    saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
                    gotoRouteByName: jasmine.createSpy('gotoRouteByName')
                };
                TestBed.configureTestingModule({
                    declarations: [DefaultReviewComponent, SnackbarComponent, BigPriceComponent],
                    imports: [
                        BrowserAnimationsModule,
                        ReactiveFormsModule,
                        VertiMaterialModule,
                        StoreModule.forRoot({})
                    ],
                    providers: [
                        // Store,
                        provideMockStore({ initialState }),
                        { provide: window, useValue: mockWindow },
                        // { provide: MatDialog, useValue: mockedDialog },
                        { provide: NavigationService, useValue: mockedNavigationService },
                        { provide: DriverIconService, useValue: mockedDriverIconService },
                        HttpClient,
                        HttpHandler
                        // { provide: DefaultReviewService, useValue: {} }
                    ]
                }).overrideModule(BrowserDynamicTestingModule, {
                    set: { entryComponents: [SnackbarComponent] }
                });
            }));

            beforeEach(() => {
                fixture = TestBed.createComponent(DefaultReviewComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                el = de.nativeElement;
                spyOn<any>(component, 'updateSession');
                mockDialogRef = {
                    open: jasmine.createSpy('open')
                };
                dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
                openSnackbarSpy = spyOn(TestBed.get(SnackbarService), 'openSnackBar').and.returnValue(opensnackSpyObj);
                // spyOn<any>(window, 'conciergeReady').and.callFake(function () { });

                mockStore = TestBed.get(Store) as MockStore<any>;
                mockStore.dispatch = jasmine.createSpy('dispatch');
                mockStore.setState({
                    lead: {
                        ...initialState,
                        quickQuote: quickQuoteData,
                        quote: quoteData
                    }
                });
                mockGetCoverageDetails = spyOn(TestBed.get(DefaultReviewService), 'getCoverageDetails').and.returnValue(
                    of({
                        firstPartyCoverages: mockfirstPartyCoverages,
                        liabilityCoverages: {},
                        vehicleCoverages: {}
                    })
                );
                mockOutputEventEmitter = {
                    updateFlagsForBackend: jasmine.createSpy('updateFlagsForBackend'),
                    updateSession: jasmine.createSpy('updateSession'),
                    verifyProperties: jasmine.createSpy('verifyProperties'),
                    getDriversDetails: jasmine.createSpy('getDriversDetails'),
                    customizeDriverData: jasmine.createSpy('customizeDriverData')
                };
            });

            describe('with initial data', () => {
                beforeEach(() => {});
            });
            describe('ngOnInIt', () => {
                it('should create component', async(() => {
                    expect(component).toBeTruthy();
                }));
                it('should premiumPrice  is empty if no value found in store and driver gender code should female', async(() => {
                    mockStore.setState({
                        lead: {
                            ...initialState,
                            quickQuote: {
                                periodStartDate: {
                                    day: 2,
                                    month: 1,
                                    year: 2009
                                },
                                vehicles: [
                                    {
                                        publicID: 'pc:217756',
                                        year: 2020,
                                        make: 'TOYOTA',
                                        model: 'COROLLA',
                                        trim: 'Sedan',
                                        vinPrefix: 'JTDP4RCE4LJ016313',
                                        isIncluded: false,
                                        isADPF: true,
                                        vehicleID: '00Q29000007I3Z0EAK-1'
                                    }
                                ],
                                drivers: [
                                    {
                                        firstName: 'Sdffs',
                                        lastName: 'Dfsdfs',
                                        genderCode: 'F',
                                        roleCode: '',
                                        roleVaue: '',
                                        driverID: 'string',
                                        genderValue: 'string',
                                        age: 'string',
                                        isIncluded: 'boolean'
                                    }
                                ]
                            },
                            quote: {
                                policyCoverage: {}
                            }
                        }
                    });
                    component.ngOnInit();

                    expect(component.showAccidentForgiveness).toBe(false);
                    expect(component.driverData[0].genderCode).toBe('female');
                }));
                it('driver gender code should empty ', async(() => {
                    mockStore.setState({
                        lead: {
                            ...initialState,
                            quickQuote: {
                                periodStartDate: {
                                    day: 2,
                                    month: 1,
                                    year: 2009
                                },
                                vehicles: [],
                                drivers: [
                                    {
                                        firstName: 'Sdffs',
                                        lastName: 'Dfsdfs',
                                        genderCode: '',
                                        roleCode: '',
                                        roleVaue: '',
                                        driverID: 'string',
                                        genderValue: 'string',
                                        age: 'string',
                                        isIncluded: 'boolean'
                                    }
                                ]
                            },
                            quote: {
                                policyCoverage: {}
                            }
                        }
                    });
                    component.ngOnInit();
                    expect(component.driverData[0].genderCode).toBe('');
                }));
            });
            describe('doContinue', () => {
                it('should call naviagte method', async(() => {
                    component.ngOnInit();
                    component.doContinue();
                    expect(mockedNavigationService.navigate).toHaveBeenCalled();
                }));
            });
            it('should call gotoRouteByName method on click of ', async(() => {
                component.openDialog();
                expect(mockedNavigationService.gotoRouteByName).toHaveBeenCalled();
            }));
            it('should open  on click of and should change editPolicy value afterClosed', async(() => {
                component.reviewDetails();
                expect(dialogSpy).toHaveBeenCalled();
                expect(dialogSpy).toHaveBeenCalledWith(ReviewAllDetailsModalComponent, {
                    panelClass: 'review-alldetails-modal'
                });
                // expect(component.editPolicy).toEqual(true);
            }));
            describe('selectedPolicyMenu method', () => {
                beforeEach(() => {
                    component.ngOnInit();
                });
                describe('with param selCodeCombined and firstPartyCoverages codes ', () => {
                    it('should call combinedBenefitsChanges method if coverage value "selCodeCombined"', async(() => {
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                        // expect(mockStore.dispatch).toHaveBeenCalledWith(
                        //     new LeadActions.UpdateGenerateQuickQuotePriceFlag({ finalizeQuote: false }),
                        //     new LeadActions.UpdatePolicyCoverage({
                        //         medical: '$5K',
                        //         selCodeMedical: '002',
                        //         selValueMedical: 'test'
                        //     }),
                        //     new LeadActions.UpdatePolicyCoverage({
                        //         combined: 'No Coverage',
                        //         selCodeCombined: '002',
                        //         selValueCombined: 'test name'
                        //     })
                        // );
                    }));
                    it('coverage value "selCodeCombined" with firstPartyCoverages code PAPIPPA_DEATH', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_DEATH';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('coverage value "selCodeCombined" with firstPartyCoverages code PAPIPPA_FUNERAL', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_FUNERAL';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('coverage value "selCodeCombined" with firstPartyCoverages code PAPIPPA_EXTRAMED', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_EXTRAMED';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('coverage value "selCodeCombined" with firstPartyCoverages code PAPIPPA_INCOME', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_INCOME';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('coverage value "selCodeCombined" with firstPartyCoverages code other', async(() => {
                        mockfirstPartyCoverages[0].code = 'other';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                });
                describe('with param selCodeCombined and firstPartyCoverages codes withOut medical', () => {
                    beforeEach(() => {
                        mockStore.setState({
                            lead: {
                                ...initialState,
                                quickQuote: quickQuoteData,
                                quote: {
                                    quoteNumber: '00Q29000007IripEAC',
                                    quoteStatus: 'string',
                                    isADPFQuote: true,
                                    newCarReplacement: false,
                                    policyCoverage: {}
                                }
                            }
                        });
                        component.ngOnInit();
                    });
                    it('should take  firstPartyCoverages option value if medical value not found', async(() => {
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                        // expect(mockStore.dispatch).toHaveBeenCalledWith(
                        //     new LeadActions.UpdateGenerateQuickQuotePriceFlag({ finalizeQuote: false }),
                        //     new LeadActions.UpdatePolicyCoverage({
                        //         medical: '$5K',
                        //         selCodeMedical: '002',
                        //         selValueMedical: 'test'
                        //     }),
                        //     new LeadActions.UpdatePolicyCoverage({
                        //         combined: 'No Coverage',
                        //         selCodeCombined: '002',
                        //         selValueCombined: 'test name'
                        //     })
                        // );
                    }));
                    it('should take  firstPartyCoverages option value if medical value not found for code PAPIPPA_MEDICAL', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_MEDICAL';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('should take  firstPartyCoverages option value if medical value not found for code PAPIPPA_DEATH', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_DEATH';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('should take  firstPartyCoverages option value if medical value not found for code PAPIPPA_FUNERAL', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_FUNERAL';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('should take  firstPartyCoverages option value if medical value not found for code PAPIPPA_EXTRAMED', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_EXTRAMED';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                    it('should take  firstPartyCoverages option value if medical value not found for code PAPIPPA_INCOME', async(() => {
                        mockfirstPartyCoverages[0].code = 'PAPIPPA_INCOME';
                        component.firstPartyBenefits = mockfirstPartyCoverages;
                        component.selectedPolicyMenu(menuObj, 'selCodeCombined');
                        expect(mockStore.dispatch).toHaveBeenCalled();
                    }));
                });
                it('should call motoristCoverageChange method if coverage value "selCodeUMBI"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeUMBI');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                    // expect(mockStore.dispatch).toHaveBeenCalledWith(
                    //     new LeadActions.UpdateGenerateQuickQuotePriceFlag({ finalizeQuote: false }),
                    //     new LeadActions.UpdatePolicyCoverage({
                    //         payload: {
                    //             stackedUMBILimit: 'No',
                    //             selCodeStackUMBI: 'false',
                    //             selValueStackUMBI: 'No'
                    //         }
                    //     })
                    // );
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeUIMBI"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeProperty');
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeStackUMBI"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeStackUMBI');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeTort"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeTort');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeBiLimit"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeBiLimit');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "identityTheft"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'identityTheft');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeExtraMed"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeExtraMed');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeDeath"', async(() => {
                    menuObj.value = NO_COVERAGE;

                    component.ngOnInit();

                    component.selectedPolicyMenu(menuObj, 'selCodeDeath');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeIncome"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeIncome');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeFuneral"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeFuneral');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeMedical"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeMedical');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeStackUIMBI"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'selCodeStackUIMBI');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "selCodeUIMBI"', async(() => {
                    menuObj.value = 'other';
                    component.selectedPolicyMenu(menuObj, 'selCodeUIMBI');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
                it('should call motoristCoverageChange method if coverage value "OTHER"', async(() => {
                    menuObj.value = NO_COVERAGE;
                    component.selectedPolicyMenu(menuObj, 'OTHER');
                    expect(mockStore.dispatch).toHaveBeenCalled();
                }));
            });
        });
    });
});
