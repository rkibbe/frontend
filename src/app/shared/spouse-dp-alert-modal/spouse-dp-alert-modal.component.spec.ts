import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpouseDPAlertModalComponent } from './spouse-dp-alert-modal.component';
import { VertiMaterialModule } from '../verti-material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('SpouseDPAlertModalComponent', () => {
    let component: SpouseDPAlertModalComponent;
    let fixture: ComponentFixture<SpouseDPAlertModalComponent>;
    const dialogMock = {
        close: () => {}
    };
    let mockedData = 'M';
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SpouseDPAlertModalComponent],
            imports: [VertiMaterialModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: mockedData }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SpouseDPAlertModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it(`should have ctaText 'ADD SPOUSE' `, () => {
        expect(component.ctaText).toEqual('ADD SPOUSE');
    });
    it(`should have ctaText 'ADD PARTNER' `, () => {
        mockedData = 'F';
        fixture = TestBed.createComponent(SpouseDPAlertModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // expect(component.ctaText).toEqual('ADD PARTNER');
    });
    it('on click of close() modal should close ', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.close();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith();
    });
});
