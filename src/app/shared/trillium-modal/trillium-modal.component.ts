import { Component, Inject, EventEmitter, Output, HostBinding } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Address } from '@app/store/models/lead.model';

export interface TrilliumModalData {
    uspsSuggestion: Address;
    userEntered: Address;
    invalidAddress?: boolean;
    partialAddress?: boolean;
}

@Component({
    selector: 'verti-trillium-modal',
    templateUrl: './trillium-modal.component.html',
    styleUrls: ['./trillium-modal.component.scss']
})
export class TrilliumModalComponent {
    @HostBinding('class.verti-trillium-modal') mainClass = true;

    @Output() trilliumAddressUpdate = new EventEmitter();

    uspsSuggestion = '';
    userEntered = '';

    partialAddress = false;
    invalidAddress = false;

    constructor(
        private dialogRef: MatDialogRef<TrilliumModalComponent>,
        @Inject(MAT_DIALOG_DATA) data: TrilliumModalData
    ) {
        this.dialogRef.disableClose = true;

        this.partialAddress = !!data.partialAddress;
        this.invalidAddress = !!data.invalidAddress;

        if (data.uspsSuggestion) {
            this.uspsSuggestion = this.addressToStr(data.uspsSuggestion);
        }

        if (data.userEntered) {
            this.userEntered = this.addressToStr(data.userEntered);
        }
    }

    private addressToStr(addr: Address): string {
        return (
            addr.addressLine1 +
            (addr.addressLine2 ? ', ' + addr.addressLine2 : '') +
            ', ' +
            addr.city +
            ', ' +
            addr.state +
            ', ' +
            addr.postalCode
        );
    }

    updateAddress() {
        this.trilliumAddressUpdate.emit(true);
        this.dialogRef.close(true);
    }

    useEnteredAddress() {
        this.trilliumAddressUpdate.emit(false);
        this.dialogRef.close(false);
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
