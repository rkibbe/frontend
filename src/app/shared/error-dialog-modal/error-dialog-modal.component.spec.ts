import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PageImageTitleComponent } from '../page-image-title/page-image-title.component';
import { ErrorDialogModalComponent } from './error-dialog-modal.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ErrorDialogModalComponent', () => {
    let component: ErrorDialogModalComponent;
    let fixture: ComponentFixture<ErrorDialogModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorDialogModalComponent, PageImageTitleComponent],
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
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialog },
                { provide: MAT_DIALOG_DATA, useValue: { code: 6092, message: '' } }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorDialogModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should create', () => {
        component.errorData = undefined;
        component.ngOnInit();
        expect(component.errorCode).toEqual('');
        expect(component.errorMessage).toEqual('');
    });
    it('should close dailog for close method', () => {
        component.close();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
});
