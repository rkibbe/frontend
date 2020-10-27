import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleHolderModalComponent } from './title-holder-modal.component';
import { VertiMaterialModule } from '../verti-material.module';
import { TitleHolder } from 'src/app/store/models/lead.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

describe('TitleHolderModalComponent', () => {
    let component: TitleHolderModalComponent;
    let fixture: ComponentFixture<TitleHolderModalComponent>;
    const mockedData = 'trusteeExt';
    const dialogMock = {
        close: () => {}
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TitleHolderModalComponent],
            imports: [VertiMaterialModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: mockedData }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TitleHolderModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it(`should be check titleHolderType is 'TRUST' `, () => {
        expect(TitleHolder.TRUST).toEqual(component.titleHolderType);
    });
    it(`should be check titleHolderType is 'UNKNOWN' `, () => {
        component.titleHolderType = TitleHolder.UNKNOWN;
        fixture.detectChanges();
        expect(TitleHolder.UNKNOWN).toEqual(component.titleHolderType);
    });
    it(`should be check titleHolderType is 'COMPANY' `, () => {
        component.titleHolderType = TitleHolder.COMPANY;
        fixture.detectChanges();
        expect(TitleHolder.COMPANY).toEqual(component.titleHolderType);
    });
    it(`should be check titleHolderType is 'OWNED' `, () => {
        component.titleHolderType = TitleHolder.OWNED;
        fixture.detectChanges();
        expect(TitleHolder.OWNED).toEqual(component.titleHolderType);
    });

    it('on click of onContactClick modal should close with value "true"', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.onContactClick();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(true);
    });
    it('on click of onCloseClick modal should close with value "false"', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.onCloseClick();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(false);
    });
});
