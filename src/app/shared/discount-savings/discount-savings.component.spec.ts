import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSavingsComponent } from './discount-savings.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromStore from '../../store/reducers/lead.reducers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DiscountSavingsComponent', () => {
    let component: DiscountSavingsComponent;
    let fixture: ComponentFixture<DiscountSavingsComponent>;
    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiscountSavingsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
            providers: [provideMockStore({ initialState })]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscountSavingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                firstName: 'verti',
                gender: 'F',
                genderCode: 'F',
                genderValue: 'Female',
                generateQuickQuotePrice: false,
                insuranceType: 'auto',
                lastName: 'app',
                leadID: '00Q29000007kiYlEAI',
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
                    savings: '255.45',
                    // paymentPlans: allPlans,
                    nextPaymentDueDate: {
                        day: 22,
                        month: 10,
                        year: 2008
                    }
                }
            }
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('first name should be equal verti', () => {
        expect(component.firstName).toEqual('verti');
    });
    it('should emit scrollToClassName when scrollTo is clicked', () => {
        spyOn(component.scrollToClassName, 'emit');
        const selectedClassName = 'goToDiscountSavings';
        component.scrollTo(selectedClassName);
        expect(component.scrollToClassName.emit).toHaveBeenCalledTimes(1);
        expect(component.scrollToClassName.emit).toHaveBeenCalledWith(selectedClassName);
    });
});
