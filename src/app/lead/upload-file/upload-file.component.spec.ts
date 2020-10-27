import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from '@services/navigation.service';
import { UploadfileService } from '@services/uploadfile.service';
import { AddfileModalComponent } from '@shared/addfile-modal/addfile-modal.component';
import { AllowModalComponent } from '@shared/allow-modal/allow-modal.component';
import { CaptureModalComponent } from '@shared/capture-modal/capture-modal.component';
import { DeleteModalComponent } from '@shared/delete-modal/delete-modal.component';
import { SentModalComponent } from '@shared/sent-modal/sent-modal.component';
import { SharedModule } from '@shared/shared.module';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { ValidfileModalComponent } from '@shared/validfile-modal/validfile-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WebcamModule } from 'ngx-webcam';
import { of, throwError } from 'rxjs';
import { Driver, LicenseStatus, LicenseYears, TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { UploadFileComponent } from './upload-file.component';
import { TranslateModule } from '@ngx-translate/core';



describe('UploadFileComponent', () => {
    let component: UploadFileComponent;
    let fixture: ComponentFixture<UploadFileComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    let dialogSpy;
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
            vehicleID: 'SSDDSDD55',
            publicId: 'string',
            year: 'string',
            make: '2009',
            model: 'CHAVROLET',
            trim: 'TRIM',
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
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        policyNumber: '3423423'
    };
    const mockRouter = {
        navigate: jasmine.createSpy('naviagte')
    };
    const mockUploadService = {
        upload: jasmine.createSpy('upload').and.returnValue(of({ message: 100 }))
    };
    const mocldeviceDetector = {
        isDesktop: jasmine.createSpy('isDesktop').and.returnValue(of(true))
    };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(''), close: null });
    dialogRefSpyObj.componentInstance = { body: '' };
    const activatedRouteStub = { paramMap: of(convertToParamMap({ id: '1' })) };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFileComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot({}),
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                SharedModule,
                NgCircleProgressModule,
                WebcamModule,
                TranslateModule.forRoot()
            ],
            providers: [
                // { provide: MatDialog, useValue: mockMatDialog },
                { provide: NavigationService, useValue: mockNavigationService },
                { provide: UploadfileService, useValue: mockUploadService },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Router, useValue: mockRouter },
                { provide: DeviceDetectorService, useValue: mocldeviceDetector },

                provideMockStore({ initialState })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFileComponent);
        component = fixture.componentInstance;
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open');
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: { campaignID: '534353534' },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: mockVehicle,
                    drivers: mockDriver,
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {
                    quoteNumber: '424234333',
                    verificationDocuments: [
                        {
                            title: 'Proof of driving history',
                            docTypeId: 'drive_hist_proof',
                            displayText: 'hgghg  jj'
                        },

                        {
                            title: 'Visual documentation',
                            docTypeId: 'dl_picture',
                            displayText: 'hgghg  jj'
                        }
                    ],
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                },
                enterprisePartyID: 'WRWRRIRR333ED'
            }
        });
        fixture.detectChanges();
    });

    it('Should Create Upload File Component', () => {
        expect(component).toBeTruthy();
    });
    it('Should open SentModalComponent on click of openSentDialog', () => {
        component.openSentDialog();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(SentModalComponent, {
            panelClass: 'verti-sent-modal'
        });
    });
    it('Should open AddfileModalComponent on click of openAddfileDialog', () => {
        component.openAddfileDialog();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(AddfileModalComponent, {
            panelClass: 'verti-addfile-modal'
        });
    });
    it('Should open ValidfileModalComponent on click of openValidfileDialog', () => {
        component.openValidfileDialog();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(ValidfileModalComponent, {
            panelClass: 'verti-validfile-modal'
        });
    });
    it('Should open AllowModalComponent on click of openAllowDialog', () => {
        component.openAllowDialog();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(AllowModalComponent, {
            panelClass: 'verti-allow-modal'
        });
    });
    it('Should open TimeoutModalComponent on click of openTimeoutDialog', () => {
        component.openTimeoutDialog();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    });
    it('Should open CaptureModalComponent on click of openCaptureDialog', () => {
        const SpyObj = jasmine.createSpyObj({
            afterClosed: of({ imageAsDataUrl: 'test url', _mimeType: '1' }),
            close: null
        });
        dialogRefSpyObj.componentInstance = { body: '' };
        dialogSpy.and.returnValue(SpyObj);
        component.openCaptureDialog();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(CaptureModalComponent, {
            panelClass: 'verti-capture-modal'
        });
    });
    it('Should open DeleteModalComponent on click of openSentDialog', () => {
        const SpyObj = jasmine.createSpyObj({ afterClosed: of({ status: true, fileIndex: '1' }), close: null });
        dialogRefSpyObj.componentInstance = { body: '' };
        dialogSpy.and.returnValue(SpyObj);
        component.openDeleteDialog(1);
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(DeleteModalComponent, {
            panelClass: 'verti-delete-modal',
            data: { fileIndex: 1 }
        });
    });
    it('Should dispatch UpdateDocumentStatusAction for upload success response ', () => {
        const SpyObj = jasmine.createSpyObj({ afterClosed: of({ status: true, fileIndex: '1' }), close: null });
        dialogRefSpyObj.componentInstance = { body: '' };
        dialogSpy.and.returnValue(SpyObj);
        component.docPreviews = [
            {
                sub_title: 'test sub titile',
                doc_icon: {
                    result: 'base64,pdf;dJDSJDJDSDSDJDJDMDMDDSDJSDIJKJSKDJSKDJSKDJSDKSKKDK'
                }
            }
        ];
        component.onSubmit();
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new LeadActions.UpdateDocumentStatusAction({
                pos: component.docIndex,
                preview: component.previewCode,
                fileType: 'base64,pdf',
                uploadStatus: true
            })
        );
        component.openCancelDialog(0);
    });
    it('Should open TimeoutModalComponent for upload service failuer ', () => {
        component.docPreviews = [
            {
                sub_title: 'test sub titile',
                doc_icon: {
                    result: 'base64,pdf;dJDSJDJDSDSDJDJDMDMDDSDJSDIJKJSKDJSKDJSKDJSDKSKKDK'
                }
            }
        ];
        mockUploadService.upload.and.returnValue(throwError(''));
        component.onSubmit();
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    });
    it('Should show ValidfileModalComponent for invoild type', () => {
        const SpyObj = jasmine.createSpyObj({ afterClosed: of({ status: true, fileIndex: '1' }), close: null });
        dialogRefSpyObj.componentInstance = { body: '' };
        dialogSpy.and.returnValue(SpyObj);
        component.onFileChange({ target: { files: [{ type: 'involidtype', name: 'test name' }] } });
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(ValidfileModalComponent, {
            panelClass: 'verti-validfile-modal'
        });
    });
    it('Should change icon basied on docTypeId ', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle,
                    drivers: mockDriver
                },
                quote: {
                    quoteNumber: '424234333',
                    verificationDocuments: [
                        {
                            title: 'Proof of driving history',
                            docTypeId: 'dl_picture',
                            displayText: 'hgghg  jj'
                        },

                        {
                            title: 'Visual documentation',
                            docTypeId: 'dl_picture',
                            displayText: 'hgghg  jj'
                        }
                    ]
                },
                enterprisePartyID: 'WRWRRIRR333ED'
            }
        });
        component.ngOnInit();
        expect(component.imgSource).toEqual('./assets/img/license-title-icon.svg');
        expect(component.short_content).toEqual(
            'Include the whole front side of the license showing the driver’s name, date of birth and license number.'
        );
    });
});
