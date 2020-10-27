import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { UploadfileService } from '@services/uploadfile.service';
import { AddfileModalComponent } from '@shared/addfile-modal/addfile-modal.component';
import { AllowModalComponent } from '@shared/allow-modal/allow-modal.component';
import { CancelModalComponent } from '@shared/cancel-modal/cancel-modal.component';
import { CaptureModalComponent } from '@shared/capture-modal/capture-modal.component';
import { DeleteModalComponent } from '@shared/delete-modal/delete-modal.component';
import { SentModalComponent } from '@shared/sent-modal/sent-modal.component';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { ValidfileModalComponent } from '@shared/validfile-modal/validfile-modal.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WebcamInitError } from 'ngx-webcam';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';






@Component({
    selector: 'verti-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, OnDestroy {
    imgSource: string;
    title: string;
    short_content: string;
    validation_suggestion: string;
    driverId: string;
    driverName: string;
    quoteNumber: string;
    enterprisePartyID: string;
    verifyDoc;
    docIndex;
    previewCode;

    leadSub: Subscription;
    docPreviews;

    form: FormGroup;
    error: string;
    uploadResponse = { status: '', message: '', filePath: '' };
    docType: any;
    isDesktopDevice;
    uploadRequest: Subscription;
    cancelDialogRef: MatDialogRef<CancelModalComponent, any>;

    cameraErrors: WebcamInitError[] = [];
    cameraErrorMessage: string;
    hasCameraLoadingError: boolean;
    showWebcam: boolean;
    allowCameraSwitch: boolean;
    constructor(
        public dialog: MatDialog,
        private store: Store<any>,
        private activatedRoute: ActivatedRoute,
        private navService: NavigationService,
        private router: Router,
        private formBuilder: FormBuilder,
        private uploadfileService: UploadfileService,
        private deviceDetectorService: DeviceDetectorService
    ) {
        this.imgSource = '';
        this.short_content = '';
        this.validation_suggestion = 'Upload documents as .PNG .JPG or .PDF files';
        this.docPreviews = [];
        this.hasCameraLoadingError = false;
        this.showWebcam = true;
        this.allowCameraSwitch = false;
    }

    ngOnInit() {
        this.navService.upDateMarketingData();
        this.isDesktopDevice = this.deviceDetectorService.isDesktop();
        this.form = this.formBuilder.group({
            license: ['']
        });
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.quoteNumber = leadData.quote.quoteNumber;
                this.enterprisePartyID = leadData.enterprisePartyID;
            });

        this.leadSub = this.store
            .select(fromStore.verifyDocSelector)
            .pipe(take(1))
            .subscribe(verifyDocs => {
                this.activatedRoute.paramMap.subscribe(params => {
                    this.docIndex = +params.get('id') - 1;
                    this.verifyDoc = verifyDocs[this.docIndex];
                    this.docType = this.verifyDoc.docTypeId;
                    const driverFirstName = this.verifyDoc.displayText.split(' ')[0];
                    if (this.verifyDoc.docTypeId === 'drive_hist_proof') {
                        this.title = `${driverFirstName}’s driving history`;
                        this.imgSource = './assets/img/license-title-icon.svg';
                        this.short_content = 'Proof of how long you’ve been licensed to drive from the state that issued your driver’s license.';
                    } else if (this.verifyDoc.docTypeId === 'dl_picture') {
                        this.title = `${driverFirstName}’s driver license`;
                        this.imgSource = './assets/img/license-title-icon.svg';
                        this.short_content = 'Include the whole front side of the license showing the driver’s name, date of birth and license number.';
                    }
                });
            });
    }

    ngOnDestroy() { }

    onSubmit() {
        const base64mime = this.docPreviews[0].doc_icon.result;
        const base64code = base64mime.split('base64,')[1];
        this.getPreviewCode(base64mime);

        const document = {
            quoteNumber: this.quoteNumber,
            enterprisePartyID: this.enterprisePartyID,
            docTypeId: this.verifyDoc.docTypeId,
            base64: base64code,
            fileName: this.docPreviews[0].sub_title
        };

        this.uploadRequest = this.uploadfileService.upload(document).subscribe(
            (res) => {
                this.uploadResponse = res;
                if (res.message === 100) {
                    this.store.dispatch(
                        new LeadActions.UpdateDocumentStatusAction({
                            pos: this.docIndex,
                            // base64code: base64mime,
                            preview: this.previewCode,
                            fileType: base64mime.split(';')[0],
                            uploadStatus: true
                        })
                    );
                    if (this.cancelDialogRef) {
                        this.cancelDialogRef.close({ status: false });
                    }
                    this.router.navigate(['docverify'], { queryParamsHandling: 'merge' });
                }
            },
            (err) => {
                this.openTimeoutDialog();
            }
        );
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
                    this.docPreviews.push({
                        doc_icon: file.target,
                        file_type: file_type,
                        title: this.verifyDoc.docName,
                        sub_title: file_name
                    });
                };
            } else {
                const validDialogRef = this.dialog.open(ValidfileModalComponent, {
                    panelClass: 'verti-validfile-modal'
                });
                validDialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        result.title = this.verifyDoc.docName;
                        this.docPreviews.push(result);
                    }
                });
            }
        }
    }

    getPreviewCode(originalCode) {
        const canvas = document.createElement('canvas');
        const canvasCTX = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 60;

        const img = new Image();
        img.addEventListener('load', () => {
            canvasCTX.drawImage(img, 0, 0, 50, 60);
            this.previewCode = canvas.toDataURL('image/jpeg', 1.0);
        }, false);
        img.src = originalCode;
    }

    openCancelDialog(fileIndex) {
        this.cancelDialogRef = this.dialog.open(CancelModalComponent, {
            panelClass: 'verti-cancel-modal',
            data: { fileIndex }
        });
        this.cancelDialogRef.afterClosed().subscribe(result => {
            if (result.status) {
                this.uploadRequest.unsubscribe();
                this.uploadResponse = { status: '', message: '', filePath: '' };
                this.docPreviews.splice(result.fileIndex, 1);
            }
        });
    }

    openSentDialog() {
        this.dialog.open(SentModalComponent, {
            panelClass: 'verti-sent-modal'
        });
    }

    openAddfileDialog() {
        this.dialog.open(AddfileModalComponent, {
            panelClass: 'verti-addfile-modal'
        });
    }

    openValidfileDialog() {
        this.dialog.open(ValidfileModalComponent, {
            panelClass: 'verti-validfile-modal'
        });
    }

    openAllowDialog() {
        this.dialog.open(AllowModalComponent, {
            panelClass: 'verti-allow-modal'
        });
    }

    openTimeoutDialog() {
        this.dialog.open(TimeoutModalComponent, {
            panelClass: 'verti-timeout-modal'
        });
    }

    openCaptureDialog() {
        const captureDialogRef = this.dialog.open(CaptureModalComponent, {
            panelClass: 'verti-capture-modal'
        });
        captureDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.docPreviews.push({
                    doc_icon: { result: result.imageAsDataUrl },
                    file_type: result._mimeType,
                    title: this.verifyDoc.docName,
                    sub_title: 'asdfasdf'
                });
            }
        });
    }

    openDeleteDialog(fileIndex) {
        const deleteDialogRef = this.dialog.open(DeleteModalComponent, {
            panelClass: 'verti-delete-modal',
            data: { fileIndex }
        });

        deleteDialogRef.afterClosed().subscribe(result => {
            if (result !== undefined && result.status) {
                this.docPreviews.splice(result.fileIndex, 1);
            }
        });
    }

    public handleInitError(error: WebcamInitError): void {
        this.hasCameraLoadingError = true;
        this.showWebcam = false;
        this.cameraErrorMessage = error.message;
        this.cameraErrors.push(error);
    }
}
