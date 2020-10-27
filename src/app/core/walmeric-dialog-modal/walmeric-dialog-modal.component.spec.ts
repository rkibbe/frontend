import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AppSettingsService } from '@services/app-settings.service';
import { AppSettings } from '@shared/settings/app-settings';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { WalmericDialogModalComponent } from './walmeric-dialog-modal.component';


describe('WalmericDialogModalComponent', () => {
    let component: WalmericDialogModalComponent;
    let fixture: ComponentFixture<WalmericDialogModalComponent>;

    let mockAppSettingService;
    let testData, mockDialog, dialogSpy;

    const matDialogRefStub = {
        close: () => {}
    };
    let dialogRef, mockedFormBuilder;
    const appSetting = AppSettings;

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    beforeEach(async(() => {
        mockedFormBuilder = {};
        mockDialog = MatDialog;
        testData = new AppSettings();
        dialogRef = MatDialogRef;
        mockAppSettingService = {
            getSettings() {
                return of(appSetting);
            }
        };
        TestBed.configureTestingModule({
            declarations: [WalmericDialogModalComponent],
            imports: [VertiMaterialModule, BrowserDynamicTestingModule],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefStub },
                { provide: FormBuilder, useValue: mockedFormBuilder },
                { provide: AppSettingsService, useValue: mockAppSettingService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WalmericDialogModalComponent);
        component = fixture.componentInstance;
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close the modal on click of onIconClick', async () => {
        mockAppSettingService.getSettings().subscribe(settings => {
            expect(component.appSettings).toEqual(settings);
        });
    });

    it('should call onIconClick by passing icon parameter', async(() => {
        component.onIconClick('icon');
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        spy();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    }));
    it('should call onIconClick by passing icons parameter ', async(() => {
        component.enableCall = true;
        component.onIconClick('icons');
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        spy();
        fixture = TestBed.createComponent(WalmericDialogModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
        // expect(component.enableCall).toEqual(true);
    }));
});
