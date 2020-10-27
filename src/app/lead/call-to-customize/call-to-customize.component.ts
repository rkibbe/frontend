import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@app/core/services/navigation.service';
import { VERTI_CONTACT_NUMBERS } from '@app/core/constants';
@Component({
    selector: 'verti-call-to-customize',
    templateUrl: './call-to-customize.component.html',
    styleUrls: ['./call-to-customize.component.scss']
})
export class CallToCustomizeComponent implements OnInit {
    title: string;
    message: string;
    enableCall: boolean;
    contactNumber: string;
    constructor(private navService: NavigationService) {
    }

    ngOnInit() {
        this.navService.upDateMarketingData();
        this.contactNumber = VERTI_CONTACT_NUMBERS.CALLCUSTOMIZE;
    }
}
