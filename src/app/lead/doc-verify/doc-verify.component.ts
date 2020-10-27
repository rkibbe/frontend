import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { MatDialog } from '@angular/material';

import { SentModalComponent } from '@shared/sent-modal/sent-modal.component';
import { CancelModalComponent } from '@shared/cancel-modal/cancel-modal.component';
import { WalmericDialogModalComponent } from '@app/core/walmeric-dialog-modal/walmeric-dialog-modal.component';

@Component({
    selector: 'verti-doc-verify',
    templateUrl: './doc-verify.component.html',
    styleUrls: ['./doc-verify.component.scss']
})
export class DocVerifyComponent implements OnInit, OnDestroy {
    short_content: string;
    validation_suggestion: string;
    driverObservable$: any;
    driverData: any;
    verifyDocs: Array<any>;
    continueToNext: boolean;

    leadSub: Subscription;
    docTypes: Array<any>;
    constructor(
        public store: Store<any>,
        private router: Router,
        public dialog: MatDialog,
        private navService: NavigationService) {
        this.continueToNext = false;

        this.docTypes = [
            {
                doc_icon: './assets/img/lisence-icon.svg',
                title: `Picture of driver's license`,
                docTypeId: 'dl_picture'
            },
            {
                doc_icon: './assets/img/envelope-icon.svg',
                title: 'Proof of residence',
                docTypeId: 'residence_proof'
            },
            {
                doc_icon: './assets/img/car-registration-icon.svg',
                title: 'Vehicle registration',
                docTypeId: 'veh_reg_proof'
            },
            {
                doc_icon: './assets/img/doc-icon.svg',
                title: 'Proof of current insurance',
                docTypeId: 'curr_ins_proof'
            },
            {
                doc_icon: './assets/img/car-registration-icon.svg',
                title: 'Visual documentation',
                docTypeId: 'veh_pictures'
            },
            {
                doc_icon: './assets/img/doc-icon.svg',
                title: 'Proof of driving history',
                docTypeId: 'drive_hist_proof'
            }
        ];
    }

    ngOnInit() {
        this.navService.upDateMarketingData();
        this.store
            .select(fromStore.verifyDocSelector)
            .pipe()
            .subscribe(verifyDocs => {
                this.verifyDocs = verifyDocs;
                this.verifyDocs.forEach(doc => {
                    doc.doc_icon = this.getDocIcon(doc.docTypeId);
                });
            });

        const docsTobeUploaded = this.verifyDocs.filter(
            doc => doc.docTypeId === 'drive_hist_proof' || doc.docTypeId === 'dl_picture'
        );

        if (docsTobeUploaded.length) {
            const unUploaded = docsTobeUploaded.filter(doc => !doc.uploadStatus);
            if (unUploaded && unUploaded.length) {
                this.continueToNext = false;
            } else {
                this.continueToNext = true;
            }
        }
        console.log(this.verifyDocs);
    }

    navigateToFileUpload(documentID) {
        this.router.navigate(['uploadfile/' + documentID], { queryParamsHandling: 'merge' });
    }

    ngOnDestroy() { }

    getDocIcon(docTypeId) {
        return this.docTypes.filter(doc => doc.docTypeId === docTypeId)[0].doc_icon;
    }

    openSentDialog() {
        this.dialog.open(SentModalComponent, {
            panelClass: 'verti-sent-modal'
        });
    }

    openCancelDialog() {
        this.dialog.open(CancelModalComponent, {
            panelClass: 'verti-cancel-modal'
        });
    }
    callToFinish() {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }
}
