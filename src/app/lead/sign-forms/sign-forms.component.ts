import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { SignFormsService } from '@services/sign-forms.service';
import { PdfGenerationModalComponent } from '@shared/pdf-generation-modal/pdf-generation-modal.component';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-sign-forms',
    templateUrl: './sign-forms.component.html',
    styleUrls: ['./sign-forms.component.scss']
})
export class SignFormsComponent implements OnInit, OnDestroy {
    imgSource: string;
    title: string;
    signFormsData: any;
    signFormsData1: any;
    signFormGroup: FormGroup;
    loaderStopped: boolean;
    leadSub: Subscription;
    clickedDownloadingLink: boolean;
    areFormsSigned: boolean;
    loaderSubscription: Subscription;
    longitude: string;
    latitude: string;
    formattedAddress: string;
    ipAddr: string;
    constructor(
        private fb: FormBuilder,
        private service: SignFormsService,
        private store: Store<any>,
        private dialog: MatDialog,
        private navService: NavigationService,
        private deviceService: DeviceDetectorService
    ) {
        this.imgSource = './assets/img/SignForms_Icon.svg';
        this.title = 'Accept & Sign Forms';
        this.longitude = '';
        this.latitude = '';
        this.formattedAddress = 'Location Access Denied';
        this.store
            .select(fromStore.signFormsSelector)
            .pipe(take(1))
            .subscribe(signForms => {
                this.signFormsData = signForms;
            });
        this.store
            .select(fromStore.quoteSelector)
            .pipe(take(1))
            .subscribe(quote => {
                this.areFormsSigned = quote.formsSigned || false;
            });
        this.clickedDownloadingLink = false;
    }
    ngOnInit() {
        this.navService.upDateMarketingData();
        this.signFormGroup = this.fb.group(
            this.signFormsData.reduce((acc, curr) => ({ ...acc, [curr['formNumber']]: true }), {})
        );
        /* Validators added to each fromcontrolname */
        Object.keys(this.signFormGroup.controls).forEach((key: string) => {
            this.signFormGroup.controls[key].setValidators([Validators.required, Validators.requiredTrue]);
            this.signFormGroup.controls[key].updateValueAndValidity();
        });
        this.signFormGroup.patchValue(this.signFormsData);
        this.signFormGroup.updateValueAndValidity();
        this.service.getPosition().then(
            pos => {
                this.latitude = pos.lat;
                this.longitude = pos.long;
                this.formattedAddress = pos.addr.formatted_address;
            },
            err => {
                this.latitude = '';
                this.longitude = '';
                this.formattedAddress = 'Location Access Denied';
            }
        );
        this.service.getIp().subscribe(
            res => {
                this.ipAddr = res.ip;
            },
            err => { }
        );
    }
    saveDetails() {
        if (!this.areFormsSigned) {
            this.signFormsData = this.updateSignFormStatus();
            const SignatureCertificates = {
                ipAddress: this.ipAddr,
                viewedOnDateAndTime: moment().format(),
                signedOnDateAndTime: moment().format(),
                signedSource: this.getDeviceType(),
                latitude: this.latitude,
                longitude: this.longitude,
                formattedAddress: this.formattedAddress
            };
            this.store.dispatch(
                new LeadActions.SaveQuote({
                    signForms: this.signFormsData,
                    signatureCertificates: SignatureCertificates
                })
            );
            this.loaderStopped = false;
            this.leadSub = this.store
                .select(fromStore.leadSelector)
                .pipe(take(1))
                .subscribe((leadData: Lead) => {
                    this.store.dispatch(new LeadActions.SignFormAction(leadData));
                });
            this.loaderSubscription = this.store
                .select(appState => appState.loader.isLoading)
                .subscribe(loading => {
                    if (!loading && !this.loaderStopped) {
                        if (this.leadSub) {
                            this.leadSub.unsubscribe();
                        }
                        this.loaderStopped = true;
                        this.navService.navigate();
                    }
                });
        } else {
            this.navService.navigate();
        }
    }
    toggle(formNumber) {
        const fId = this.signFormGroup.controls[formNumber].value;
        this.signFormGroup.get(formNumber).setValue(fId);
        this.signFormGroup.updateValueAndValidity();
    }
    updateSignFormStatus() {
        return this.signFormsData.map(signForm => {
            signForm.formStatus = 'ElectronicallySigned';
            return signForm;
        });
    }
    openDialog() {
        this.dialog.open(PdfGenerationModalComponent, {
            panelClass: 'pdf_generation_modal'
        });
    }
    openPDF(documentId, documentName) {
        if (!this.clickedDownloadingLink) {
            this.openDialog();
            this.clickedDownloadingLink = true;
        }
        this.fetchDoc(documentId, documentName);
    }
    fetchDoc(documentId, documentName) {
        this.service.getSignFormBase64(documentId).subscribe(
            res => {
                if (!res['error']) {
                    this.generatePdf(res['file'], documentName);
                }
            },
            error => {
                this.openDialog();
            }
        );
    }
    generatePdf(base64String, documentName) {
        let blob;
        let blobURL;
        const fileType = 'application/pdf';
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const input = base64String.replace(/\s/g, '');
            const byteCharacters = atob(input);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: fileType });

            window.navigator.msSaveOrOpenBlob(blob, documentName + '.pdf');
        } else if (window.navigator.userAgent.match('CriOS')) {
            // Chrome iOS
            blob = this.converBase64toBlob(base64String, fileType);
            const reader: any = new FileReader();
            reader.onloadend = () => {
                window.open(reader.result);
            };
            reader.readAsDataURL(blob);
        } else if (window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/iPhone/i)) {
            // Safari & Opera iOS
            blob = this.converBase64toBlob(base64String, fileType);
            const url: any = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('onclick', 'window.open(' + "'" + url + "'" + ', "_blank")');
            a.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
        } else {
            blob = this.converBase64toBlob(base64String, 'application/pdf');
            blobURL = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            const fileName = documentName + '.pdf';
            downloadLink.href = blobURL;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            setTimeout(() => {
                if (downloadLink) {
                    document.body.removeChild(downloadLink);
                }
                window.URL.revokeObjectURL(blobURL);
            }, 100);
        }
    }
    converBase64toBlob(content, contentType) {
        contentType = contentType || '';
        const sliceSize = 512;
        const byteCharacters = window.atob(content); // method which converts base64 to binary
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {
            type: contentType
        }); // statement which creates the blob
    }
    public getDeviceType() {
        let signedSource;
        if (this.deviceService.isDesktop()) {
            signedSource = 'Desktop';
        } else if (this.deviceService.isTablet()) {
            signedSource = 'Tablet';
        } else if (this.deviceService.isMobile()) {
            signedSource = 'Mobile';
        } else {
            signedSource = '';
        }
        return signedSource;
    }
    ngOnDestroy() {
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
