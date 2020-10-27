import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'verti-page-image-title',
    templateUrl: './page-image-title.component.html',
    styleUrls: ['./page-image-title.component.scss']
})
export class PageImageTitleComponent implements OnInit {
    @Input('imgsource') imgsource: string;
    @Input('imgsource2') imgsource2: string;
    @Input() imgwidth: string;
    @Input() imgheight: string;
    @Input() imgwidth2: string;
    @Input() imgheight2: string;
    @Input('title') title: string;
    @Input() reversed;
    @Input('subTitle') subTitle: string;
    @Output() modalOpen = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    onClickOfI() {
        this.modalOpen.emit();
    }
}
