import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { ValidfileModalComponent } from './validfile-modal.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { WebcamModule, WebcamInitError } from 'ngx-webcam';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { CaptureModalComponent } from '../capture-modal/capture-modal.component';

describe('ValidfileModalComponent', () => {
    let component: ValidfileModalComponent;
    let fixture: ComponentFixture<ValidfileModalComponent>;
    let element;
    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockMatDialogRef = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    const mockWindow = {
        FileReader: jasmine.createSpy('FileReader')
    };
    // error: WebcamInitError
    const mockeWebcamInitError = {
        error: jasmine.createSpy('error')
    };
    const mockWebCam: WebcamInitError[] = [];
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValidfileModalComponent],
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
                WebcamModule
            ],
            providers: [
                DeviceDetectorService,
                { provide: window, useValue: mockWindow },
                { provide: WebcamInitError, useValue: mockeWebcamInitError },
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: MAT_DIALOG_DATA, useValue: { code: 6092, message: '' } }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValidfileModalComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close modal on click oof close ', () => {
        component.close();
        expect(mockMatDialogRef.close).toHaveBeenCalled();
    });
    it('should call onFileChange ', () => {
        const imgSource = './assets/img/Icon_AddVehicle.svg';
        const event = { target: { type: 'image/png', name: 'file test', target: imgSource } };
        // let event = {
        //     target: {
        //         files: [
        //             { type: 'image/png', name: 'file test', target: imgSource },
        //             { type: 'image/png', name: 'file test', target: imgSource }
        //         ]
        //     }
        // };
        spyOn(component, 'onFileChange').and.callThrough();
        component.onFileChange(event);
        fixture.detectChanges();
        expect(component.onFileChange).toHaveBeenCalledWith(event);
    });
    it('should call handleInitError ', () => {
        const event: WebcamInitError = {
            message: 'error',
            mediaStreamError: {
                constraintName: 'string',
                message: 'string',
                name: 'string'
            }
        };
        spyOn(component, 'handleInitError').and.callThrough();
        component.handleInitError(event);
        fixture.detectChanges();
        expect(component.handleInitError).toHaveBeenCalledWith(event);
    });

    it('should open CaptureModalComponent on click of openCaptureDialog  ', () => {
        const SpyObj = jasmine.createSpyObj({
            afterClosed: of({ imageAsDataUrl: 'test@url', _mimeType: 'test Type' }),
            close: null
        });
        mockMatDialog.open.and.returnValue(SpyObj);
        component.openCaptureDialog();
        expect(mockMatDialogRef.close).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(CaptureModalComponent, {
            panelClass: 'verti-capture-modal'
        });
        expect(mockMatDialogRef.close).toHaveBeenCalledWith({
            doc_icon: { result: 'test@url' },
            file_type: 'test Type',
            sub_title: 'asdfasdf'
        });
    });
});
