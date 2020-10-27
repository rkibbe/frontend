import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverComponent } from './add-driver.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { UserFormComponent } from '@shared/user-form/user-form.component';
import { StoreModule, Store } from '@ngrx/store';
import { reducers } from 'src/app/store/reducers';
import { RouterTestingModule } from '@angular/router/testing';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('AddDriverComponent', () => {
    let component: AddDriverComponent;
    let fixture: ComponentFixture<AddDriverComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const mockedDriverObj1 = [
        {
            age: 20,
            dateOfBirth: {
                day: 2,
                month: 2,
                year: 2000
            },
            driverID: '00Q29000007VDQiEAO-2',
            firstName: 'fff',
            genderCode: 'F',
            genderValue: 'Female',
            isADPF: false,
            isAlreadyIncluded: true,
            isIncluded: true,
            isVisible: true,
            lastName: 'gggg',
            licenseRevoked: 'false',
            majorViolations: 'false',
            maritalStatusCode: 'M',
            maritalStatusValue: 'Married',
            noOfAccidentsAndViolations: {
                noOfAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none',
                noOfMovingViolations: 'none',
                noOfNotAtFaultAccidents: 'none'
            }
        }
    ];
    const mockedDriverObj2 = [
        {
            age: 30,
            dateOfBirth: {
                day: 12,
                month: 11,
                year: 2000
            },
            driverID: '00Q29000007VDQiEAO-2',
            firstName: 'fff',
            genderCode: 'F',
            genderValue: 'Female',
            isADPF: true,
            isAlreadyIncluded: true,
            isIncluded: true,
            isVisible: true,
            lastName: 'gggg',
            licenseRevoked: 'false',
            majorViolations: 'false',
            maritalStatusCode: 'M',
            maritalStatusValue: 'Married',
            noOfAccidentsAndViolations: {
                noOfAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none',
                noOfMovingViolations: 'none',
                noOfNotAtFaultAccidents: 'none'
            }
        }
    ];
    const mockedDriverObj3 = [
        {
            age: 30,
            dateOfBirth: {
                day: 13,
                month: 11,
                year: 2000
            },
            driverID: '00Q29000007VDQiEAO-2',
            firstName: 'fff',
            genderCode: 'F',
            genderValue: 'Female',
            isADPF: false,
            isAlreadyIncluded: true,
            isIncluded: true,
            isVisible: true,
            lastName: 'gggg',
            licenseRevoked: 'false',
            majorViolations: 'false',
            maritalStatusCode: 'M',
            maritalStatusValue: 'Married',
            noOfAccidentsAndViolations: {
                noOfAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none',
                noOfMovingViolations: 'none',
                noOfNotAtFaultAccidents: 'none'
            }
        }
    ];
    const mockedDriverObj4 = [
        {
            age: 30,
            dateOfBirth: '1/3/2000',
            driverID: '00Q29000007VDQiEAO-2',
            firstName: 'fff',
            genderCode: 'F',
            genderValue: 'Female',
            isADPF: false,
            isAlreadyIncluded: true,
            isIncluded: true,
            isVisible: true,
            lastName: 'gggg',
            licenseRevoked: 'false',
            majorViolations: 'false',
            maritalStatusCode: 'M',
            maritalStatusValue: 'Married',
            noOfAccidentsAndViolations: {
                noOfAtFaultAccidents: 'none',
                noOfComprehensiveClaims: 'none',
                noOfMovingViolations: 'none',
                noOfNotAtFaultAccidents: 'none'
            }
        }
    ];

    let mockedFormBuilder,
        mockedRouter,
        mockedHttpClient,
        mockedStore,
        mockedNavigationService,
        mockedActivated,
        mockeMatDialog,
        mockedDateFormatter,
        mockedDataLayerService;
    beforeEach(async(() => {
        mockedFormBuilder = {};
        mockedRouter = {};
        mockedHttpClient = {};
        mockedStore = {};
        mockedNavigationService = {};
        mockedActivated = {
            paramMap: of(
                convertToParamMap({
                    id: '2'
                })
            ),
            snapshot: {
                queryParams: {
                    id: '2'
                }
            }
        };
        mockeMatDialog = {};
        mockedDateFormatter = {};
        mockedDataLayerService = {};

        component = new AddDriverComponent(
            mockedFormBuilder,
            mockedRouter,
            mockedHttpClient,
            mockedStore,
            mockedNavigationService,
            mockedActivated,
            mockeMatDialog,
            mockedDateFormatter,
            mockedDataLayerService
        );

        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(reducers),
                RouterTestingModule,
                VertiMaterialModule,
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot()
            ],
            declarations: [AddDriverComponent, PageImageTitleComponent, UserFormComponent],
            providers: [
                // { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockedActivated }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddDriverComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        mockedStore = TestBed.get(Store);

        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedDriverObj1));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be selectedDriver driverId', () => {
        component.ngOnInit();
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedDriverObj1));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
        expect(component.driverId).toEqual('00Q29000007VDQiEAO-2');
    });

    it('should have adpf data and age', () => {
        component.ngOnInit();
        fixture = TestBed.createComponent(AddDriverComponent);
        component = fixture.componentInstance;
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedDriverObj2));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
        expect(component.driverId).toEqual('00Q29000007VDQiEAO-2');
    });
    it('dateOfBirth: month and day value > 10 ', () => {
        component.ngOnInit();
        fixture = TestBed.createComponent(AddDriverComponent);
        component = fixture.componentInstance;
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedDriverObj3));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
        expect(component.driverId).toEqual('00Q29000007VDQiEAO-2');
    });
    it('dateOfBirth value is string ', () => {
        component.ngOnInit();
        fixture = TestBed.createComponent(AddDriverComponent);
        component = fixture.componentInstance;
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedDriverObj4));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
        expect(component.driverId).toEqual('00Q29000007VDQiEAO-2');
    });
});
