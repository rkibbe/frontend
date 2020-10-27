import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'verti-pdf-generation-modal',
    templateUrl: './pdf-generation-modal.component.html',
    styleUrls: ['./pdf-generation-modal.component.scss']
})
export class PdfGenerationModalComponent implements OnInit {
    title: string;
    imgSource: any;

    constructor(public dialogRef: MatDialogRef<PdfGenerationModalComponent>) {
        this.dialogRef.disableClose = true;
        this.imgSource = './assets/img/Refresh_Icon.svg';
        this.title = `PDF generation in progress…`;
    }

    close() {
        this.dialogRef.close();
    }

    ngOnInit() {}
}
