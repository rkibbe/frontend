import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '@env/environment';

import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
    selector: 'verti-allow-modal',
    templateUrl: './capture-modal.component.html',
    styleUrls: ['./capture-modal.component.scss']
})
export class CaptureModalComponent implements OnInit {
    public title: string;
    public message: string;
    errorMessage: string;

    @Output() public pictureTaken = new EventEmitter<WebcamImage>();

    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];
    public hasErrors: boolean;

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

    constructor(
        public captureDialogRef: MatDialogRef<CaptureModalComponent>,
        @Inject(MAT_DIALOG_DATA) public errorData
    ) {
        this.captureDialogRef.disableClose = true;
        this.errorMessage = '';
        this.hasErrors = false;
    }

    public ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
            this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        });
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
        this.hasErrors = true;
        this.errorMessage = error.message;
        this.errors.push(error);
    }

    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
    }

    public handleImage(webcamImage: WebcamImage): void {
        // console.log('received webcam image', webcamImage);
        this.captureDialogRef.close(webcamImage);
        this.pictureTaken.emit(webcamImage);
    }

    public cameraWasSwitched(deviceId: string): void {
        // console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }

    close(): void {
        // errorCode might be string or number so used ==
        this.captureDialogRef.close();
    }
}
