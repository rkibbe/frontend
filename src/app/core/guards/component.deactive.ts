import { HostListener } from '@angular/core';

export class ComponentCanDeactivate {
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        // if (!this.canDeactivate()) {
        //     $event.returnValue = true;
        // }
        $event.returnValue = false;
    }
}
