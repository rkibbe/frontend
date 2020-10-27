import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Formatter } from '../formatters/formatter';

@Directive({
    selector: '[formControlName][vertiInputMask], [formControl][vertiInputMask]'
})
export class InputMaskDirective {
    @Input() formatter: Formatter;

    constructor(public ngControl: NgControl) {}

    @HostListener('input', ['$event'])
    onInputChange(event): void {
        if (event.target.value) {
            const formattedValue = this.formatter.format(event.target.value);
            if (formattedValue !== event.target.value) {
                this.ngControl.control.setValue(formattedValue);
            }
        }
    }

    @HostListener('keydown.backspace', ['$event'])
    onBackspaceDown(event): void {
        if (
            event.target.value &&
            event.target.selectionStart &&
            event.target.selectionEnd &&
            event.target.selectionStart === event.target.selectionEnd
        ) {
            event.preventDefault();
            let strippedVal = this.formatter.removeUnimportantChars(event.target.value);

            if (strippedVal) {
                const backspacePos = this.getBackspacePos(event.target.value, event.target.selectionEnd);

                strippedVal = strippedVal.substr(0, backspacePos - 1) + strippedVal.substr(backspacePos);
                this.ngControl.control.setValue(this.formatter.format(strippedVal));
            } else {
                this.ngControl.control.setValue(strippedVal);
            }
        }
    }

    getBackspacePos(value: string, endPos: number): number {
        const subStrAtPos = value.substr(0, endPos);
        const stripped = this.formatter.removeUnimportantChars(subStrAtPos);
        const diff = subStrAtPos.length - stripped.length;

        return endPos - diff;
    }
}
