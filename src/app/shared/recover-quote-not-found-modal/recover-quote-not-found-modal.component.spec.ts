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
import { RecoverQuoteNotFoundModalComponent } from './recover-quote-not-found-modal.component';
import { NavigationService } from '@services/navigation.service';

describe('RecoverQuoteNotFoundModalComponent', () => {
    let component: RecoverQuoteNotFoundModalComponent;
    let fixture: ComponentFixture<RecoverQuoteNotFoundModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecoverQuoteNotFoundModalComponent],
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
                { provide: MatDialogRef, useValue: mockMatDialog },
                {
                    provide: NavigationService,
                    useValue: {
                        upDateMarketingData: jasmine.createSpy('updateMarketingData'),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
                        gotoRouteByName: jasmine.createSpy('gotoRouteByName')
                    }
                },
                { provide: MAT_DIALOG_DATA, useValue: { code: 6092, message: '' } }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoverQuoteNotFoundModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close dailog for onCloseClick method', () => {
        component.onCloseClick();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
    it('should close dailog for onTryAgainClick method', () => {
        component.onTryAgainClick();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
    it('should close dailog for onTryAgainClick method', () => {
        component.onStartNewQuoteClick();
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
});
