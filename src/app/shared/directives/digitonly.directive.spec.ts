import { VertiDigitDirective } from './digitonly.directive';
import { ElementRef } from '@angular/core';

describe('VertiDigitDirective', () => {
    describe('blockInvalidCharacters', () => {
        let directive: VertiDigitDirective;
        let elementRef: ElementRef;
        // const event = new Event('input');
        beforeEach(() => {
            elementRef = {
                nativeElement: {
                    value: jasmine.createSpy('value')
                }
            };
            directive = new VertiDigitDirective(elementRef);
        });

        it('should create an instance VertiDigitDirective', () => {
            expect(directive).toBeTruthy();
        });

        // it('should not modify an empty value', () => {
        //     elementRef.nativeElement.value = '34234fg454';
        //     directive.onInputChange(event);
        //     // expect(boundControl.control.setValue).not.toHaveBeenCalled();
        //     expect(elementRef.nativeElement.value).not.toHaveBeenCalled();
        //     // expect(elementRef.nativeElement.value).toHaveBeenCalledWith('34234454');
        // });
    });
});
