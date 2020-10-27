import { InputMaskDirective } from './input-mask.directive';
import { DateFormatter } from '../formatters/date-formatter';

describe('InputMaskDirective', () => {
    let directive: InputMaskDirective;
    let boundControl;
    let dateFormatter: DateFormatter;
    let testEvent;

    beforeEach(() => {
        dateFormatter = jasmine.createSpyObj('DateFormatter', ['format', 'removeUnimportantChars']);

        boundControl = {
            control: {
                setValue: jasmine.createSpy('setValue')
            }
        };

        testEvent = {
            preventDefault: jasmine.createSpy('preventDefault'),
            target: {
                selectionStart: undefined,
                selectionEnd: undefined,
                value: undefined
            }
        };

        directive = new InputMaskDirective(boundControl);
        directive.formatter = dateFormatter;
    });

    describe('onInputChange', () => {
        it('should create an instance', () => {
            expect(directive).toBeTruthy();
        });

        it('should do nothing if empty string is passed', () => {
            testEvent.target.value = '';

            directive.onInputChange(testEvent);

            expect(dateFormatter.format).not.toHaveBeenCalled();
            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should do nothing if string does not change after format', () => {
            const formattedStr = '12/1';
            testEvent.target.value = formattedStr;
            dateFormatter.format = jasmine.createSpy('format').and.returnValue(formattedStr);

            directive.onInputChange(testEvent);

            expect(dateFormatter.format).toHaveBeenCalled();
            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should update the controls value if formatted value is different', () => {
            const unformattedStr = '121';
            const formattedStr = '12/1';
            testEvent.target.value = unformattedStr;
            dateFormatter.format = jasmine.createSpy('format').and.returnValue(formattedStr);

            directive.onInputChange(testEvent);

            expect(dateFormatter.format).toHaveBeenCalled();
            expect(boundControl.control.setValue).toHaveBeenCalledWith(formattedStr);
        });
    });

    describe('onBackspaceDown', () => {
        it('should create an instance', () => {
            expect(directive).toBeTruthy();
        });

        it('should do nothing if empty string is passed', () => {
            testEvent.target.value = '';

            directive.onBackspaceDown(testEvent);

            expect(testEvent.preventDefault).not.toHaveBeenCalled();
            expect(dateFormatter.removeUnimportantChars).not.toHaveBeenCalled();
            expect(dateFormatter.format).not.toHaveBeenCalled();
            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should do nothing if selectionStart does not equal selectionEnd', () => {
            testEvent.target.value = 'not empty';
            testEvent.target.selectionStart = 1;
            testEvent.target.selectionEnd = 3;

            directive.onBackspaceDown(testEvent);

            expect(testEvent.preventDefault).not.toHaveBeenCalled();
            expect(dateFormatter.removeUnimportantChars).not.toHaveBeenCalled();
            expect(dateFormatter.format).not.toHaveBeenCalled();
            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should do nothing if selectionStart does not equal selectionEnd', () => {
            testEvent.target.value = 'not empty';
            testEvent.target.selectionStart = 1;
            testEvent.target.selectionEnd = 3;

            directive.onBackspaceDown(testEvent);

            expect(testEvent.preventDefault).not.toHaveBeenCalled();
            expect(dateFormatter.removeUnimportantChars).not.toHaveBeenCalled();
            expect(dateFormatter.format).not.toHaveBeenCalled();
            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should unformat passed value and return empty string if no valid characters', () => {
            const testStr = 'not empty';

            testEvent.target.value = testStr;
            testEvent.target.selectionStart = 1;
            testEvent.target.selectionEnd = 1;
            dateFormatter.removeUnimportantChars = jasmine.createSpy('removeUnimportantChars').and.returnValue('');

            directive.onBackspaceDown(testEvent);

            expect(testEvent.preventDefault).toHaveBeenCalled();
            expect(dateFormatter.removeUnimportantChars).toHaveBeenCalledWith(testStr);
            expect(dateFormatter.format).not.toHaveBeenCalled();
            expect(boundControl.control.setValue).toHaveBeenCalledWith('');
        });

        it('should unformat passed value and return formatted string with end valid character removed', () => {
            const beforeStrippedStr = '12 / 12 / ';
            const afterStrippedStr = '1212';
            const beforeFormatStr = '121';
            const afterFormatStr = '12 / 1';

            testEvent.target.value = beforeStrippedStr;
            testEvent.target.selectionStart = 1;
            testEvent.target.selectionEnd = 1;

            dateFormatter.removeUnimportantChars = jasmine
                .createSpy('removeUnimportantChars')
                .and.returnValue(afterStrippedStr);
            dateFormatter.format = jasmine.createSpy('format').and.returnValue(afterFormatStr);

            directive.onBackspaceDown(testEvent);

            expect(testEvent.preventDefault).toHaveBeenCalled();
            expect(dateFormatter.removeUnimportantChars).toHaveBeenCalledWith(beforeStrippedStr);
            expect(dateFormatter.format).toHaveBeenCalledWith(beforeFormatStr);
            expect(boundControl.control.setValue).toHaveBeenCalledWith(afterFormatStr);
        });
    });
});
