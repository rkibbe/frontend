import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { ExistingDamageComponent } from '@shared/existing-damage/existing-damage.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { TitleHolder, Vehicle } from 'src/app/store/models/lead.model';
import { leadSelector } from 'src/app/store/reducers/lead.reducers';
import { VehicleDamageComponent } from './vehicle-damage.component';
import { TranslateModule } from '@ngx-translate/core';



describe('VehicleDamageComponent', () => {
    let component: VehicleDamageComponent;
    let fixture: ComponentFixture<VehicleDamageComponent>;

    let store: MockStore<any>;

    const initialState = { lead: fromStore.initialState };
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
    const formBuilder: FormBuilder = new FormBuilder();
    const mockWindow = {
        dataLayer: []
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VehicleDamageComponent, PageImageTitleComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot(leadSelector),
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
                { provide: window, useValue: mockWindow },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                {
                    provide: NavigationService,
                    useValue: {
                        upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
                    }
                },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: MatDialog, useValue: mockMatDialog },
                provideMockStore({ initialState })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VehicleDamageComponent);
        component = fixture.componentInstance;
        component.vehicleDamageForm = formBuilder.group({
            testId: ['32322']
        });
        store = TestBed.get(Store) as MockStore<any>;
        store.dispatch = jasmine.createSpy('dispatch');
        store.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    vehicles: mockVehicle
                }
            }
        });

        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should have coorect values get from the store ', () => {
        component.ngOnInit();
        expect(component.vehicleData).toEqual(mockVehicle);
    });
    it('checkBodyStyleCode should return true for style code  ', () => {
        const result = component.checkBodyStyleCode('CG');
        expect(result).toEqual(true);
    });
    it('should open ExistingDamageComponent for on onModalOpen ', () => {
        component.onModalOpen();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(ExistingDamageComponent, {
            data: 'modal opened',
            panelClass: 'existing-damage-modal'
        });
    });
    it('vehicleDamageForm value should true if checked false in slecetd vehicle ', () => {
        component.onChange({ checked: true }, mockVehicle[0]);
        expect(component.vehicleDamageForm.controls[mockVehicle[0].vehicleID].value).toEqual(false);
    });
    it('vehicleDamageForm value should false if unrepairDamage false in slecetd vehicle ', () => {
        component.isClickable(mockVehicle[0]);
        expect(component.vehicleDamageForm.controls[mockVehicle[0].vehicleID].value).toEqual(false);
    });
    it('should dispatch UpdateAllVehicles on click of saveDetails ', () => {
        component.saveDetails();
        expect(store.dispatch).toHaveBeenCalled();
    });
});
