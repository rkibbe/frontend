import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as RecoverQuoteActions from '@app/store/actions/recover-quote.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from '@services/navigation.service';
import { RecoverquoteService } from '@services/recoverquote.service';
import { RecoverQuoteNotFoundModalComponent } from '@shared/recover-quote-not-found-modal/recover-quote-not-found-modal.component';
import { AppSettings } from '@shared/settings/app-settings';
import { SharedModule } from '@shared/shared.module';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { RecoverQuoteComponent } from './recover-quote.component';
import { TranslateModule } from '@ngx-translate/core';




describe('RecoverQuoteComponent', () => {
    let component: RecoverQuoteComponent;
    let fixture: ComponentFixture<RecoverQuoteComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState,
        recoverQuote: {
            searchCriteria: {
                firstName: '',
                lastName: '',
                email: '',
                dob: '',
                zipCode: ''
            }
        }
    };

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockRouter = {
        naviagte: jasmine.createSpy('naviagte')
    };
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
    };
    const visibleRoutes = [
        {
            referringURL: '',
            routeName: 'basicinfo',
            visible: true,
            preFill: true,
            generateQuickQuotePrice: false,
            rateQuote: false,
            finalizeQuote: false,
            updatePaymentPlan: false,
            evo: false,
            replaceUrl: false,
            validateDriver: false,
            validateRules: false
        },
        {
            referringURL: '',
            routeName: 'contactinfo',
            visible: true,
            preFill: true,
            generateQuickQuotePrice: false,
            rateQuote: false,
            finalizeQuote: false,
            updatePaymentPlan: false,
            evo: false,
            replaceUrl: false,
            validateDriver: false,
            validateRules: false
        },
        {
            referringURL: '',
            routeName: 'homeaddress',
            visible: true,
            preFill: true,
            generateQuickQuotePrice: false,
            rateQuote: false,
            finalizeQuote: false,
            updatePaymentPlan: false,
            evo: false,
            replaceUrl: false,
            validateDriver: false,
            rules: ['productUWRuleCheck', 'productAvailabiltyRuleCheck'],
            validateRules: false
        }
    ];
    const mockRecoverQuoteService = {
        getQuotes: jasmine.createSpy('getQuotes').and.returnValue(of({ success: 'success' }))
    };

    const mockDriver: Driver[] = [
        {
            driverID: '00Q2900066007WiX0EAK-1',
            genderImg: 'string',
            licenseNumber: '65656565',
            firstName: 'Kavink',
            lastName: 'Sdfsddfsddsf',
            genderCode: 'F',
            genderValue: 'Male',
            age: '11',
            dateOfBirth: { year: 2009, month: 2, day: 13 },
            isIncluded: true,
            isPNI: true,
            maritalStatusCode: 'F',
            maritalStatusValue: 'Married',
            isADPF: false,
            isVisible: true,
            ownInsuranceApprovedExt: true,
            recordStatus: {
                statusCode: 45445,
                statusDescrition: 'string'
            },
            accidentsAndViolations: {
                accidentsAndViolationsId: 'string',
                violationCode: 'string',
                incidentType: 'string',
                incidentDate: {
                    year: 2009,
                    month: 5,
                    day: 5
                },
                recordStatus: {
                    statusCode: 45445,
                    statusDescrition: 'string'
                },
                error: {
                    code: '6565',
                    errorDescription: 'string'
                }
            },
            noOfAccidentsAndViolations: {
                noOfMovingViolations: 'none',
                noOfAtFaultAccidents: 'none',
                noOfNotAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none'
            },
            relationshipCode: '',
            relationshipValue: '',
            licenseState: 'PA',
            yearsLicensed: LicenseYears.LessThanSixMonths,
            isQuoteDriver: true,
            licenseStatus: LicenseStatus.NeverLicensed,
            licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
            yearsLicensedValue: 'Less than 6 months',
            publicId: 'pc:447252',
            error: {
                code: '6565',
                errorDescription: 'string'
            }
        },
        {
            driverID: '00Q29000007WiX0EAK-1',
            genderImg: 'string',
            licenseNumber: '65656565',
            firstName: 'Kavink',
            lastName: 'Sdfsddfsddsf',
            genderCode: 'M',
            genderValue: 'Male',
            age: '11',
            dateOfBirth: { year: 2009, month: 2, day: 13 },
            isIncluded: true,
            isPNI: true,
            maritalStatusCode: 'M',
            maritalStatusValue: 'Married',
            isADPF: false,
            isVisible: true,
            ownInsuranceApprovedExt: true,
            recordStatus: {
                statusCode: 45445,
                statusDescrition: 'string'
            },
            accidentsAndViolations: {
                accidentsAndViolationsId: 'string',
                violationCode: 'string',
                incidentType: 'string',
                incidentDate: {
                    year: 2009,
                    month: 5,
                    day: 5
                },
                recordStatus: {
                    statusCode: 45445,
                    statusDescrition: 'string'
                },
                error: {
                    code: '6565',
                    errorDescription: 'string'
                }
            },
            noOfAccidentsAndViolations: {
                noOfMovingViolations: 'none',
                noOfAtFaultAccidents: 'none',
                noOfNotAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none'
            },
            relationshipCode: '',
            relationshipValue: '',
            licenseState: 'PA',
            yearsLicensed: LicenseYears.LessThanSixMonths,
            isQuoteDriver: true,
            licenseStatus: LicenseStatus.NeverLicensed,
            licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
            yearsLicensedValue: 'Less than 6 months',
            publicId: 'pc:447252',
            error: {
                code: '6565',
                errorDescription: 'string'
            }
        }
    ];
    const mockVehicle: Vehicle[] = [
        {
            // vehicleId = leadId-1
            vehicleID: 'string',
            publicId: 'string',
            year: 'string',
            make: 'string',
            model: 'string',
            trim: 'string',
            vin: 'string',
            bodyStyle: 'string',
            vinPrefix: 'string',
            bodyStyleDesc: 'string',
            trimDesc: 'string',
            bodyStyleCode: 'string',
            stubbedVIN: 'string',
            isIncluded: true,
            isAlreadyIncluded: true,
            isADPF: true,
            isQuoteVehicle: true,
            recordStatus: {
                statusCode: 6776,
                statusDescrition: 'string'
            },
            error: {
                code: 'string',
                errorDescription: 'string'
            },
            unrepairDamage: true,
            leaseOrRent: true,
            owned: true,
            additionalInterests: [],
            titleHolder: TitleHolder.COMPANY,
            isVisible: true,
            isStubbedVin: true,
            compDeductible: 'string',
            compDisplayValue: 'string',
            selCodeComp: 'string',
            selValueComp: 'string',
            collDisplayValue: 'string',
            collDeductible: 'string',
            selValueColl: 'string',
            selCodeColl: 'string',
            displayRoadsideAssistance: true
        }
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecoverQuoteComponent],
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
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: RecoverquoteService, useValue: mockRecoverQuoteService },
                { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
                { provide: NavigationService, useValue: mockNavigationService },
                provideMockStore({ initialState }),
                AppSettings
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoverQuoteComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: mockDriver,
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {},
                searchCriteria: {
                    firstName: 'test name',
                    lastName: 'test last name',
                    email: 'test@gmail.com',
                    dob: '12/12/2009',
                    zipCode: '503221'
                },
                recoverQuote: {
                    searchCriteria: {
                        firstName: 'test name',
                        lastName: 'test last name',
                        email: 'test@gmail.com',
                        dob: '12/12/2009',
                        zipCode: '503221'
                    }
                }
            },
            recoverQuote: {
                searchCriteria: {
                    firstName: 'test name',
                    lastName: 'test last name',
                    email: 'test@gmail.com',
                    dob: '12/12/2009',
                    zipCode: '503221'
                }
            }
        });
        component.recoverQuoteForm.patchValue({
            firstName: 'test name',
            lastName: 'test last name',
            email: 'test@gmail.com',
            dob: '12/12/2009',
            zipCode: '503221'
        });
        component.visibleRouteList = visibleRoutes;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should not show error message for valid DOB onDOBBlur', () => {
        component.onDOBBlur();
        expect(component.showDOBError).toBe(false);
    });
    it('should not show error message for valid email onEmailBlur', () => {
        component.onEmailBlur();
        expect(component.showEmailError).toBe(false);
    });
    it('should not show error message for valid zipCode onZipCodeBlur', () => {
        component.onZipCodeBlur();
        expect(component.showZipCodeError).toBe(false);
    });
    it('should set valid zip control', () => {
        component.validateZipCode('20976');
        expect(component.zipCodeControl.value).toEqual('503221');
    });
    it('should navigate to next route on click of onStartNewQuoteClick', () => {
        component.onStartNewQuoteClick();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalled();
        expect(mockNavigationService.gotoRouteByName).toHaveBeenCalledWith(visibleRoutes[0].routeName);
    });
    it('should open RecoverQuoteNotFoundModalComponent on click of onContinueClick', () => {
        component.onContinueClick();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(RecoverQuoteNotFoundModalComponent, {
            panelClass: 'quote-not-found-modal-panel'
        });
    });

    it('should disaptch and naviagte to routes for getQuotes service success on click of searchQuotes', () => {
        component.searchQuotes();
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new RecoverQuoteActions.SearchQuoteAction({ success: 'success' })
        );
    });
    it('should open RecoverQuoteNotFoundModalComponent for getQuotes service error response on click of searchQuotes', () => {
        mockRecoverQuoteService.getQuotes.and.returnValue(of({ error: { code: '2332' } }));
        component.searchQuotes();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(RecoverQuoteNotFoundModalComponent, {
            panelClass: 'quote-not-found-modal-panel',
            data: visibleRoutes[0].routeName
        });
    });
    it('should open TimeoutModalComponent for getQuotes service failuer  on click of searchQuotes', () => {
        mockRecoverQuoteService.getQuotes.and.returnValue(throwError(''));
        component.searchQuotes();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    });
    it('should disaptch and naviagte to routes', () => {
        mockRecoverQuoteService.getQuotes.and.returnValue(of({ error: { code: 651600 } }));
        component.searchQuotes();
    });
});
