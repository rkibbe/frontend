import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'verti-previous-bodily-injury-modal',
  templateUrl: './previous-bodily-injury-modal.component.html',
  styleUrls: ['./previous-bodily-injury-modal.component.scss']
})
export class PreviousBodilyInjuryModalComponent implements OnInit {
  title: string;
  imgSource: string;
  constructor(
      public dialogRef: MatDialogRef<PreviousBodilyInjuryModalComponent> // @Inject(MAT_DIALOG_DATA) public data: DialogTitle
  ) {
      this.dialogRef.disableClose = true;
  }

  ngOnInit() {
      this.title = 'Previous Bodily Injury Coverage';
      // this.imgSource = './assets/img/Icon_help2.svg';
  }

  close(): void {
      this.dialogRef.close();
  }
}
