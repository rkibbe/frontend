import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'verti-dotted-list-item',
    templateUrl: './dotted-list-item.component.html',
    styleUrls: ['./dotted-list-item.component.scss']
})
export class DottedListItemComponent implements OnInit {
    @HostBinding('class.verti-dotted-list-item') mainClass = true;

    constructor() {}

    ngOnInit() {}
}
