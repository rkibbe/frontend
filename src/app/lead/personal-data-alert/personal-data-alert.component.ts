import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'verti-personal-data-alert',
    templateUrl: './personal-data-alert.component.html',
    styleUrls: ['./personal-data-alert.component.scss']
})
export class PersonalDataAlertComponent implements OnInit {
    contactNumber: string;
    imgSource: string;
    title: string;
    subTitle: string;
    constructor() {
        this.imgSource = './assets/img/_warning.svg';
        this.title = 'Warning';
        this.subTitle = 'PERSONAL DATA ALERT';
    }

    ngOnInit() {
        this.contactNumber = '1-412-593-5415';
    }
}
