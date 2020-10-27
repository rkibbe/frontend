import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInputComponent } from './address-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { VertiMaterialModule } from '../verti-material.module';
import { SharedModule } from '../shared.module';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutofillAddressComponent } from '../autofill-address/autofill-address.component';
import { ManualAddressComponent } from '../manual-address/manual-address.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { AddressPipe } from '../pipes/address.pipe';
import { Store, StoreModule } from '@ngrx/store';
import { Router, RouterEvent } from '@angular/router';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject } from 'rxjs';

describe('AddressInputComponent', () => {
    let component: AddressInputComponent;
    let fixture: ComponentFixture<AddressInputComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };
    const eventSubject = new ReplaySubject<RouterEvent>(1);


    const firstNameControl = new FormControl('', Validators.required);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddressInputComponent, AutofillAddressComponent, ManualAddressComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                CoreModule,
                VertiMaterialModule,
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule,
                StoreModule.forRoot({})
            ],
            providers: [
                HttpClient,
                HttpHandler,
                AddressPipe,
                provideMockStore({ initialState }),                {
                    provide: Router,
                    useValue: {
                        events: eventSubject.asObservable(),
                        url: 'test/url',
                        navigate: jasmine.createSpy('navigate')
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressInputComponent);
        component = fixture.componentInstance;
        const formControlObj = {};
        formControlObj['autofillAddress'] = firstNameControl;
        component.form = new FormGroup(formControlObj);
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                marketingData: { campaignID: '534353534' },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: [],
                    drivers: [],
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {
                    quoteNumber: '424234333',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                }
            }
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call toggleManualAddress', () => {
        component.toggleManualAddress({
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: '15001',
            country: 'string',
            county: 'string',
            isAddressVerified: true,
            manualAddress: true
        });
        expect(component.form.controls.manualAddress.value).toEqual(null);
    });
    it('should call toggleManualAddress', () => {
        component.writeValue({
            manualAddress: {
                addressLine1: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                postalCode: '15001',
                country: 'string',
                county: 'string',
                isAddressVerified: true,
                manualAddress: true
            }
        });
        expect(component.form.controls.manualAddress.value).toEqual(null);
    });
});
