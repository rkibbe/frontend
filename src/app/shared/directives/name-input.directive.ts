import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName][vertiNameInput]'
})
export class NameInputDirective {
    constructor(public ngControl: NgControl) {}

    @HostListener('input')
    blockInvalidCharacters() {
        const currValue = this.ngControl.value;
        if (currValue) {
            const newValue = currValue.replace(/[^a-zA-Z\'\-\s]/g, '');

            if (newValue !== currValue) {
                this.ngControl.control.setValue(newValue);
            }
        }
    }

    @HostListener('blur')
    trimWhiteSpace() {
        const value = this.ngControl.value;
        if (value) {
            const trimmedValue = value.trim();
            if (trimmedValue !== value) {
                this.ngControl.control.setValue(trimmedValue);
            }
        }
    }
}
