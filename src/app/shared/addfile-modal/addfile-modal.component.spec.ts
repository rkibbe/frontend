import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfileModalComponent } from './addfile-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { VertiMaterialModule } from '../verti-material.module';
import { CoreModule } from '@angular/flex-layout';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('AddfileModalComponent', () => {
    let component: AddfileModalComponent;
    let fixture: ComponentFixture<AddfileModalComponent>;

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddfileModalComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                CoreModule,
                VertiMaterialModule,
            ],
            providers:[
                { provide: MatDialogRef, useValue: mockMatDialog },
                { provide: MAT_DIALOG_DATA, useValue: {code:'8999', title:''} },

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddfileModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close modal on click of close', () => {
        component.close()
        expect(mockMatDialog.close).toHaveBeenCalled();
    });
});
