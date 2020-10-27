import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { TrilliumModalComponent } from './trillium-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('TrilliumModalComponent', () => {
    let component: TrilliumModalComponent;
    let fixture: ComponentFixture<TrilliumModalComponent>;
    const mockMatDialogref = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockDailogData = {
        uspsSuggestion: {
            addressLine1: 'Add1',
            addressLine2: 'Add2',
            city: 'test city',
            state: 'test state',
            postalCode: '33902'
        },
        userEntered: {
            addressLine1: ' userEntered Add1',
            addressLine2: 'userEntered Add2',
            city: 'test city',
            state: 'test state',
            postalCode: '33902'
        },
        invalidAddress: true,
        partialAddress: true
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrilliumModalComponent],
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
                { provide: MAT_DIALOG_DATA, useValue: mockDailogData},
                { provide: MatDialogRef, useValue: mockMatDialogref }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrilliumModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should emit the value and close the dailog on click of updateAddress ', () => {
        const spy = spyOn(component.trilliumAddressUpdate, 'emit');
        component.updateAddress();
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(true);
        expect(mockMatDialogref.close).toHaveBeenCalled();
        expect(mockMatDialogref.close).toHaveBeenCalledWith(true);
    });
    it('should emit the value and close the dailog on click of useEnteredAddress', () => {
        const spy = spyOn(component.trilliumAddressUpdate, 'emit');
        component.useEnteredAddress();
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(false);
        expect(mockMatDialogref.close).toHaveBeenCalled();
        expect(mockMatDialogref.close).toHaveBeenCalledWith(false);
    });
    it('should  close the dailog on click of onClose', () => {
        component.onClose();
        expect(mockMatDialogref.close).toHaveBeenCalled();
    });
});
