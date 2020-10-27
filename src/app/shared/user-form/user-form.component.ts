import { Component, EventEmitter, Output, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateFormatter } from '../formatters/date-formatter';

@Component({
    selector: 'verti-user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements AfterViewInit {
    @Output() formGroupValue = new EventEmitter();
    @Input('formGroup') formGroup: FormGroup;
    @Input('disableInput') disableInput;
    @ViewChild('dob') dob: ElementRef;
    showDOBError: boolean;

    constructor(private dateFormatter: DateFormatter) {
    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (this.dob) {
                this.dob.nativeElement.focus();
                this.dob.nativeElement.blur();
            }
        });
    }
    saveDetails() {
        this.formGroupValue.emit(this.formGroup.value);
    }

    onDOBBlur() {
        this.showDOBError = !!this.hasDateError();
    }

    hasInvalidDateErr() {
        return this.formGroup.controls.DOB.hasError('invalidDate');
    }

    hasDateOutOfRangeErr() {
        return this.formGroup.controls.DOB.hasError('dateOutOfRange');
    }

    hasDateError() {
        return this.hasInvalidDateErr() || this.hasDateOutOfRangeErr();
    }
}
