import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { IncludedDriverModalComponent } from './included-driver-modal.component';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('IncludedDriverModalComponent', () => {
    let component: IncludedDriverModalComponent;
    let fixture: ComponentFixture<IncludedDriverModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IncludedDriverModalComponent],
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
        fixture = TestBed.createComponent(IncludedDriverModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should matDailog close on of  onExcludeClick with false', () => {
        component.onExcludeClick();
        expect(mockMatDialog.close).toHaveBeenCalled();
        expect(mockMatDialog.close).toHaveBeenCalledWith(false);
    });
    it('should matDailog open on of  onIncludeClick with true', () => {
        component.onIncludeClick();
        expect(mockMatDialog.close).toHaveBeenCalled();
        expect(mockMatDialog.close).toHaveBeenCalledWith(false);
    });
});
