import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutModalComponent } from './timeout-modal.component';
import { VertiMaterialModule } from '../verti-material.module';
import {  MatDialogRef } from '@angular/material';

describe('TimeoutModalComponent', () => {
    let component: TimeoutModalComponent;
    let fixture: ComponentFixture<TimeoutModalComponent>;
    const dialogMock = {
        close: () => {}
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimeoutModalComponent],
            imports: [VertiMaterialModule],
            providers: [{ provide: MatDialogRef, useValue: dialogMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeoutModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('on click of close() modal should close ', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.close();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith();
    });
});
