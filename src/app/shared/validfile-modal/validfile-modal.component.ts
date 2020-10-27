import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CaptureModalComponent } from '@shared/capture-modal/capture-modal.component';
import {  WebcamInitError } from 'ngx-webcam';

import { FormBuilder, FormGroup } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'verti-validfile-modal',
    templateUrl: './validfile-modal.component.html',
    styleUrls: ['./validfile-modal.component.scss']
})
export class ValidfileModalComponent implements OnInit {
    public title: string;
    public message: string;
    errorMessage: string;

    form: FormGroup;
    isDesktopDevice;

    public cameraErrors: WebcamInitError[] = [];
    public hasCameraLoadingError: boolean;
    public cameraErrorMessage: string;
    public showWebcam = true;

    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private deviceDetectorService: DeviceDetectorService,
        public validDialogRef: MatDialogRef<ValidfileModalComponent>,
        public captureDialogRef: MatDialogRef<CaptureModalComponent>,
        @Inject(MAT_DIALOG_DATA) public errorData
    ) {
        this.validDialogRef.disableClose = true;
        this.captureDialogRef.disableClose = true;
        this.errorMessage = '';
        this.hasCameraLoadingError = false;
    }

    ngOnInit() {
        this.isDesktopDevice = this.deviceDetectorService.isDesktop();
        this.form = this.formBuilder.group({
            license: ['']
        });
    }

    onFileChange(event) {
        if (event.target.files && event.target.files[0]) {
            const file_type = event.target.files[0].type;
            const file_name = event.target.files[0].name;
            if (
                file_type === 'image/png' ||
                file_type === 'image/jpg' ||
                file_type === 'image/jpeg' ||
                file_type === 'application/pdf'
            ) {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]); // read file as data url

                reader.onload = file => {
                    // called once readAsDataURL is completed
                    const fileObj = {
                        doc_icon: file.target,
                        file_type: file_type,
                        sub_title: file_name
                    };
                    this.validDialogRef.close(fileObj);
                };
            }
        }
    }

    openCaptureDialog() {
        const captureDialogRef = this.dialog.open(CaptureModalComponent, {
            panelClass: 'verti-capture-modal'
        });
        captureDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const captureObj = {
                    doc_icon: { result: result.imageAsDataUrl },
                    file_type: result._mimeType,
                    sub_title: 'asdfasdf'
                };
                this.validDialogRef.close(captureObj);
            }
        });
    }

    close(): void {
        // errorCode might be string or number so used ==
        this.captureDialogRef.close();
        this.validDialogRef.close();
    }

    public handleInitError(error: WebcamInitError): void {
        this.hasCameraLoadingError = true;
        this.showWebcam = false;
        this.cameraErrorMessage = error.message;
        this.cameraErrors.push(error);
    }

}
