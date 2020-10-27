import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoveragesPageAlertModalComponent } from './coverages-page-alert-modal.component';
import { VertiMaterialModule } from '../verti-material.module';
import { TitleHolder } from 'src/app/store/models/lead.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '@services/shared.service';
import { NavigationService } from '@services/navigation.service';
import { Router } from '@angular/router';

describe('CoveragesPageAlertModalComponent', () => {
    let component: CoveragesPageAlertModalComponent;
    let fixture: ComponentFixture<CoveragesPageAlertModalComponent>;
    const dialogMock = {
        close: () => {}
    };
    const mockedData = true;
    let mockedRouter, mockedNavigationService, mockedSharedService;
    beforeEach(async(() => {
        mockedRouter = {};
        mockedNavigationService = {};
        mockedSharedService = {};
        TestBed.configureTestingModule({
            declarations: [CoveragesPageAlertModalComponent],
            imports: [VertiMaterialModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: mockedData },
                { provide: Router, useValue: mockedRouter },
                { provide: NavigationService, useValue: mockedNavigationService },
                { provide: SharedService, useValue: mockedSharedService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoveragesPageAlertModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('on click of stayOnThePage() modal should close ', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.stayOnThePage();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(false);
    });
    it('on click of leaveOnThePage() modal should close ', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.leaveOnThePage();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(true);
    });
});
