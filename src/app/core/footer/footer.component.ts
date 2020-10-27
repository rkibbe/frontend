import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

export interface DialogTitle {
    title: string;
}

@Component({
    selector: 'verti-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    showMobile = false;
    isMobileDevice;
    currentYear: number;
    constructor(public dialog: MatDialog) {
        this.currentYear = new Date().getFullYear();
    }

    ngOnInit() {
        this.isMobileDevice = this.isMobile();
        if (this.isMobileDevice) {
            this.showMobile = true;
        }
    }
    isMobile = () => {
        return (
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i)
        );
    };

    feedbackTrigger = e => {
        e.preventDefault();
        if (window['_kiq']) {
            window['_kiq'].push(['set', { event: 'shareFeedback' }]);
            window['_kiq'].push([
                'eventHandler',
                'close',
                function() {
                    window['_kiq'].push(['set', { event: null }]);
                }
            ]);
        }
    };
}
