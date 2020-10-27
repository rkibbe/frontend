import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatButtonToggleModule, MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { ImageDescriptionGroupComponent } from '@shared/image-description-group/image-description-group.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EMPTY, of } from 'rxjs';
import { VinDetailsService } from '../../core/services/vin-details.service';
import { VINComponent } from './vin.component';
import { TranslateModule } from '@ngx-translate/core';


describe('VINComponent', () => {
    let component: VINComponent;
    let fixture: ComponentFixture<VINComponent>;
    let de: DebugElement;
    let el: any;
    const fb = new FormBuilder();
    let mockedNavigationService;

    let getVINDetails;
    let nextButton;
    let mockedVinDetailsService;
    const controlName = '00Q29000007H2WxEAK-1';
    const mockedStoreData = [
        {
            vehicleID: '00Q29000007H2WxEAK-1',
            publicId: '234234',
            year: '2009',
            make: '343',
            model: '2009',
            trim: '676',
            vin: '',
            bodyStyle: 'uuyyu7',
            vinPrefix: 'jgjhjsd',
            bodyStyleDesc: 'hhhjj',
            trimDesc: 'hhjjas',
            bodyStyleCode: '67667',
            stubbedVIN: 'j8778',
            isIncluded: true,
            isAlreadyIncluded: false,
            isADPF: true,
            isQuoteVehicle: false,
            recordStatus: false,
            unrepairDamage: false,
            leaseOrRent: false,
            owned: false,
            titleHolder: {
                OWNED: 'PaidFor',
                LOAN: 'LIEN',
                LEASE: 'LESSOR',
                COMPANY: 'corporationExt',
                TRUST: 'trusteeExt',
                UNKNOWN: 'otherExt'
            },
            isVisible: false,
            isStubbedVin: true
        }
    ];

    const storeMock = {
        select() {
            return of(mockedStoreData);
        },
        dispatch() { }
    };

    beforeEach(async(() => {
        mockedNavigationService = {
            currentRouteObj: { preFill: false },
            upDateMarketingData: jasmine.createSpy('upDateMarketingData')
        };
        TestBed.configureTestingModule({
            declarations: [VINComponent, PageImageTitleComponent, ImageDescriptionGroupComponent],
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
                VertiMaterialModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                {
                    provide: Store,
                    useValue: storeMock
                },
                {
                    provide: DeviceDetectorService,
                    useValue: {}
                },
                {
                    provide: NavigationService,
                    useValue: mockedNavigationService
                },
                // {
                //     provide: VinDetailsService,
                //     useValue: mockedVinDetailsService
                // },
                { provide: FormBuilder, useValue: fb },
                { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: 1 })) } },
                { provide: Router, useValue: {} }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VINComponent);
        component = fixture.componentInstance;
        component.profileForm = fb.group({
            controlName: ['', Validators.required]
        });
        mockedVinDetailsService = TestBed.get(VinDetailsService);
        getVINDetails = spyOn(mockedVinDetailsService, 'getVINDetails');

        de = fixture.debugElement;
        el = de.nativeElement;
        mockedNavigationService = TestBed.get(NavigationService);
        mockedNavigationService.currentRouteObj.preFill = true;
        nextButton = de.query(By.css('.verti-next-btn')).nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
    it('should have correct title', () => {
        fixture.detectChanges();
        expect(el.innerText).toContain(`What’s your vehicle’s unique ID number (VIN)?`);
    });
    it('should have a disable button when VIN field Empty', () => {
        component.profileForm.controls[controlName].setValue('');
        fixture.detectChanges();
        expect(nextButton.disabled).toBeTruthy();
    });
    it('should have a enable button when VIN field correct value ', () => {
        component.profileForm.controls[controlName].setValue('45354533424222222');
        fixture.detectChanges();
        expect(nextButton.disabled).toBeFalsy();
    });
    it('should have a enable button when VIN field correct value ', () => {
        getVINDetails.and.callFake(function () {
            return of({});
        });
        component.profileForm.controls[controlName].setValue('45354533424222222');
        fixture.detectChanges();
        component.enteredVINInput(controlName);
        expect(nextButton.disabled).toBeFalsy();
        nextButton.click();
    });
    it('should have a enable button when VIN field correct value with error response ', () => {
        getVINDetails.and.callFake(function () {
            return EMPTY;
        });
        component.profileForm.controls[controlName].setValue('4535424222222');
        fixture.detectChanges();
        component.enteredVINInput(controlName);
    });
});
