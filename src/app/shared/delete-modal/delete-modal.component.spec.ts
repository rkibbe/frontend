import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalComponent } from './delete-modal.component';
import { VertiMaterialModule } from '../verti-material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

describe('DeleteModalComponent', () => {
    let component: DeleteModalComponent;
    let fixture: ComponentFixture<DeleteModalComponent>;
    const dialogMock = {
        close: () => {}
    };
    const mockedData = true;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeleteModalComponent],
            imports: [VertiMaterialModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: mockedData }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteModalComponent);
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
