import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PaymentMethodModalComponent } from './payment-method-modal.component';

describe('PaymentMethodModalComponent', () => {
    let component: PaymentMethodModalComponent;
    let fixture: ComponentFixture<PaymentMethodModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaymentMethodModalComponent],
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
            providers: [{ provide: MatDialogRef, useValue: mockMatDialog }, { provide: MAT_DIALOG_DATA, useValue: {} }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentMethodModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
