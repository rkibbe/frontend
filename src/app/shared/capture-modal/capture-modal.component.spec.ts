import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CaptureModalComponent } from './capture-modal.component';
import { WebcamModule } from 'ngx-webcam';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
describe('CaptureModalComponent', () => {
    let component: CaptureModalComponent;
    let fixture: ComponentFixture<CaptureModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CaptureModalComponent],
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
                HttpClientModule,
                WebcamModule
            ],
            providers: [{ provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CaptureModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
