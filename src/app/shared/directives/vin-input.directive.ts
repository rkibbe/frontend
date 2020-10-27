import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[vertiVinInput]'
})
export class VinInputDirective {
    constructor(public ngControl: NgControl) {}

    @HostListener('input', ['$event'])
    blockInvalidCharacters(event) {
        const currValue = this.ngControl.value;
        if (currValue) {
            let newValue = currValue.replace(/[^a-zA-Z0-9\s]/g, '');
            newValue = newValue.trim();
            newValue = newValue.toUpperCase();
            if (newValue !== currValue) {
                this.ngControl.control.setValue(newValue);
            }
        }
    }

    @HostListener('focus', ['$event'])
    removeError(event) {
        const currValue = this.ngControl.value;
        if (currValue && currValue.length !== 17) {
            this.ngControl.control.setErrors({
                minlength: true
            });
        } else if (currValue === null) {
            this.ngControl.control.setErrors({
                required: true
            });
        } else if (this.ngControl.errors) {
            this.ngControl.control.setErrors({
                ...this.ngControl.errors
            });
        } else {
            this.ngControl.control.setErrors(null);
        }
    }

    @HostListener('blur', ['$event'])
    trimWhiteSpace(event) {
        const value = this.ngControl.value;
        if (value && value.length !== 17) {
            this.ngControl.control.setErrors({
                incompletevin: true
            });
        }
    }
}
