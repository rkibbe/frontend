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

import { ExcludedDriverModalComponent } from './excluded-driver-modal.component';

describe('ExcludedDriverModalComponent', () => {
    let component: ExcludedDriverModalComponent;
    let fixture: ComponentFixture<ExcludedDriverModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExcludedDriverModalComponent],
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
        fixture = TestBed.createComponent(ExcludedDriverModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should matDailog close on of  onUnderstandClick ', () => {
        component.onUnderstandClick();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
});
