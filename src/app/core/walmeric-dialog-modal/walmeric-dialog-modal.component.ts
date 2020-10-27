import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AppSettingsService } from '@services/app-settings.service';
import { AppSettings } from '@shared/settings/app-settings';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';
@Component({
    selector: 'verti-walmeric-dialog-modal',
    templateUrl: './walmeric-dialog-modal.component.html',
    styleUrls: ['./walmeric-dialog-modal.component.scss']
})
export class WalmericDialogModalComponent implements OnInit, AfterViewInit {
    mobileForm: any;
    phoneNumber: any;
    enableCall: boolean;
    appSettings: AppSettings;
    contactNumber: string;
    constructor(
        public dialogRef: MatDialogRef<WalmericDialogModalComponent>,
        private _fb: FormBuilder,
        private elementRef: ElementRef,
        private appSettingService: AppSettingsService
    ) {
        this.dialogRef.disableClose = true;
        this.enableCall = false;
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    ngOnInit() {
        this.contactNumber = VERTI_CONTACT_NUMBERS.DEFAULT;
    }

    ngAfterViewInit() {
    }

    onIconClick(element): void {
        if (element === 'icon') {
            this.dialogRef.close();
        } else {
            if (this.enableCall === true) {
                this.dialogRef.close();
            }
        }
    }
}
