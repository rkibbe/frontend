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

import { ErrorModalComponent } from './error-modal.component';
import { PageImageTitleComponent } from '../page-image-title/page-image-title.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ErrorModalComponent', () => {
    let component: ErrorModalComponent;
    let fixture: ComponentFixture<ErrorModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorModalComponent, PageImageTitleComponent],
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
                { provide: MAT_DIALOG_DATA, useValue: { imgSource: 'testUrl', title: 'test title', body: 'test body' } }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct dailog data', () => {
        component.ngOnInit();
        expect(component.imgSource).toEqual('testUrl');
        expect(component.title).toEqual('test title');
        expect(component.errorBody).toEqual('test body');
    });
});
