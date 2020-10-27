import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'verti-opportunity-modal',
    templateUrl: './opportunity-modal.component.html',
    styleUrls: ['./opportunity-modal.component.scss']
})
export class OpportunityModalComponent implements OnInit {
    imgSource: string;
    constructor() {
        this.imgSource = './assets/img/Opportunity Icon.svg';
    }

    ngOnInit() {}
}
