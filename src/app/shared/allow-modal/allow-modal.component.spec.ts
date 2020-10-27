import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowModalComponent } from './allow-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { VertiMaterialModule } from '../verti-material.module';
import { CoreModule } from '@angular/flex-layout';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

describe('AllowModalComponent', () => {
    let component: AllowModalComponent;
    let fixture: ComponentFixture<AllowModalComponent>;

    let mockStore: MockStore<any>;
    const initialState = {
        lead: fromStore.initialState
    };

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AllowModalComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialog },
                provideMockStore({ initialState }),
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ],
            imports: [BrowserAnimationsModule, BrowserModule, CoreModule, VertiMaterialModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AllowModalComponent);
        component = fixture.componentInstance;
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
    it('should close modal on click of close', () => {
        component.close();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
});
