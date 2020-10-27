import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'verti-image-description-group',
    templateUrl: './image-description-group.component.html',
    styleUrls: ['./image-description-group.component.scss']
})
export class ImageDescriptionGroupComponent {
    @HostBinding('class.verti-image-description-group') mainClass = true;

    constructor() {}
}
