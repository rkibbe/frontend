import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAddressComponent } from './manual-address.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CitiesListService } from '@services/cities-list.service';
import { TrilliumAddressService } from '@services/trillium-address.service';
import { of } from 'rxjs';
import { Address } from 'src/app/store/models/lead.model';

describe('ManualAddressComponent', () => {
    let component: ManualAddressComponent;
    let fixture: ComponentFixture<ManualAddressComponent>;
    const getCitiesListResponse = {
        apiOutput: {
            result: [
                {
                    stateCode: '203203',
                    cityName: 'test name'
                }
            ]
        }
    };
    const mockGetCitilist = {
        getCitiesList: jasmine.createSpy('getCitiesList').and.returnValue(of(getCitiesListResponse))
    };
    const verifyAddressMock = {
        verifyAddress: jasmine.createSpy('verifyAddress').and.returnValue(of({ manualAddress: false }))
    };
    const mockAdress: Address = {
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        state: 'string',
        postalCode: '15001',
        county: 'string',
        country: 'string',
        manualAddress: true,
        isAddressVerified: true,
        isAutoComplete: true
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManualAddressComponent],
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
                HttpClientModule
            ],
            providers: [
                {
                    provide: CitiesListService,
                    useValue: mockGetCitilist
                },
                {
                    provide: TrilliumAddressService,
                    useValue: verifyAddressMock
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManualAddressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be readonly disabled', () => {
        component.ngOnInit();
        expect(component.form).toBeTruthy();
        const controls = component.form.controls;
        component.readonly = true;
        expect(
            controls.addressLine1 && controls.addressLine2 && controls.city && controls.state && controls.postalCode
        ).toBeTruthy();
        expect(component._readonly).toEqual(true);
    });

    it('should be readonly enabled', () => {
        component.ngOnInit();
        expect(component.form).toBeTruthy();
        const controls = component.form.controls;
        component.readonly = false;
        expect(
            controls.addressLine1 && controls.addressLine2 && controls.city && controls.state && controls.postalCode
        ).toBeTruthy();
        expect(component._readonly).toEqual(false);
    });

    it('cityControl should empty if dose not match with any postalCode ', () => {
        component.postalCodeControl.markAsDirty();
        component.postalCodeControl.setValue('50322');
        component.ngOnInit();
        expect(component.cityControl.value).toEqual('');
    });
    it('should set the error to postalCodeControl if not found any cicties from service  ', () => {
        mockGetCitilist.getCitiesList.and.returnValue(of([]));
        component.postalCodeControl.setValue('503232');
        component.ngOnInit();
        // expect( component.cityControl.value).toEqual('')
    });
    it('form values should empty if noinformation found for writeValue method  ', () => {
        component.writeValue('');
        expect(component.form.controls.addressLine1.value).toEqual('');
        expect(component.form.controls.addressLine2.value).toEqual('');
    });
    it('should have correct form values   ', () => {
        component.writeValue({
            addressLine1: 'Add1',
            addressLine2: 'Add2',
            city: 'test city',
            state: 'test state',
            postalCode: '33902'
        });
        expect(component.form.controls.addressLine1.value).toEqual('Add1');
        expect(component.form.controls.addressLine2.value).toEqual('Add2');
    });
    it('should return form control false when we call validate() ', () => {
        component.trilliumVerification = false;
        component.addressLine1Control.setValue('add1');
        component.addressLine2Control.setValue('Add2');
        component.cityControl.setValue('test city');
        component.stateControl.setValue('test state');
        component.postalCodeControl.setValue('33902');
        component.allowPOBox = false;
        const result = component.getAddress();
        expect(result).toEqual({
            addressLine1: 'add1',
            addressLine2: 'Add2',
            city: 'test city',
            state: 'test state',
            postalCode: '33902',
            country: 'US',
            manualAddress: true
        });
        component.validate();
        expect(component.form.valid).toEqual(false);
    });
    it('should call validate() with empty values ', () => {
        // component.trilliumVerification = false;
        component.addressLine1Control.setValue('');
        component.addressLine2Control.setValue('');
        component.cityControl.setValue('');
        component.stateControl.setValue('');
        component.postalCodeControl.setValue('');
        component.allowPOBox = false;
        const result = component.getAddress();
        expect(result).toEqual({
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US',
            manualAddress: true
        });
        component.validate();
        expect(component.form.valid).toEqual(false);
    });
    it('should return empty address for getAddress method ', () => {
        const mockAddress: Address = {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US',
            manualAddress: true
        };
        component.ngOnInit();
        component.allowPOBox = false;
        const result = component.getAddress();
        expect(result).toEqual(mockAddress);
        component.writeValue(mockAddress);
        expect(component.form.valid).toEqual(false);
    });
    it('should return correct address for getAddress method   ', () => {
        component.trilliumVerification = true;
        component.addressLine1Control.setValue('Add1');
        component.addressLine2Control.setValue('Add2');
        component.cityControl.setValue('test city');
        component.stateControl.setValue('test state');
        component.postalCodeControl.setValue('33902');
        const result = component.getAddress();
        // expect(result).toEqual(component.getAddress());
    });
    it('should have correct form values   ', () => {
        component.form.patchValue({
            addressLine1: 'Add1',
            addressLine2: 'Add2',
            city: 'test city',
            state: 'test state',
            postalCode: '33902'
        });
        const result = component.validate();
        expect(result).toEqual({ address: true });
    });
    xit('should set correct city value if found more then one cites from getCitiList service  ', () => {
        component.stateControl.setValue('203203');
        mockGetCitilist.getCitiesList.and.returnValue(
            of([
                {
                    apiOutput: {
                        result: [
                            {
                                stateCode: '203203',
                                cityName: 'test name'
                            },
                            {
                                stateCode: '203208',
                                cityName: 'city name 2'
                            }
                        ]
                    }
                }
            ])
        );
        component.postalCodeControl.setValue('503232');
        component.postalCodeControl.markAsPristine();

        component.cityControl.setValue('city name 2');
        component.possibleZipLocations = [
            {
                stateCode: '203203',
                cityName: 'test name'
            },
            {
                stateCode: '203208',
                cityName: 'city name 2'
            }
        ];
        component['updateCityFromPossibleLocations']();
        console.log('///////////////', component.cityControl.value);
        // expect(mockGetCitilist.getCitiesList).toHaveBeenCalled();
    });

    it('should call updatePostalCode on keyup mannul postal code input with single cityList', () => {
        const cityList = [
            {
                city: 'WEST ALIQUIPPA',
                cityCode: 'X1B883',
                county: 'BEAVER',
                countyCode: 'PA007',
                defaultcityCode: 'X16927',
                state: 'PA'
            }
        ];
        mockGetCitilist.getCitiesList.and.returnValue(of(cityList));
        component.postalCodeControl.setValue('15001');
        expect(mockGetCitilist.getCitiesList).toHaveBeenCalled();
        expect(component.cityControl.value).toEqual('');
    });

    it('should call registerOnChange method', () => {
        const changeHandler = new Function();
        component['lastPropagated'] = mockAdress;

        component.registerOnChange(changeHandler);
        const controls = component.form.controls;
        controls.addressLine1.setValue('string');
    });
});
