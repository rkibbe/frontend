import { NameInputDirective } from './name-input.directive';

describe('NameInputDirective', () => {
    describe('blockInvalidCharacters', () => {
        let directive: NameInputDirective;
        let boundControl;

        beforeEach(() => {
            boundControl = {
                value: '',
                control: {
                    setValue: jasmine.createSpy('setValue')
                }
            };
            directive = new NameInputDirective(boundControl);
        });

        it('should create an instance', () => {
            expect(directive).toBeTruthy();
        });

        it('should not modify an empty value', () => {
            boundControl.value = '';

            directive.blockInvalidCharacters();

            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should only keep letters, spaces, dashes, and apostrophes, and remove other characters', () => {
            const beforeStr = `1a2B3c4d5e6f7g8h9i0j;klmnopqrstuvwxyz-' `;
            const afterStr = `aBcdefghijklmnopqrstuvwxyz-' `;
            boundControl.value = beforeStr;

            directive.blockInvalidCharacters();

            expect(boundControl.control.setValue).toHaveBeenCalledWith(afterStr);
        });

        it('should not change the value if no characters were removed', () => {
            boundControl.value = 'aBcDe';

            directive.blockInvalidCharacters();

            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });
    });

    describe('trimWhiteSpace', () => {
        let directive: NameInputDirective;
        let boundControl;

        beforeEach(() => {
            boundControl = {
                value: '',
                control: {
                    setValue: jasmine.createSpy('setValue')
                }
            };
            directive = new NameInputDirective(boundControl);
        });

        it('should create an instance', () => {
            expect(directive).toBeTruthy();
        });

        it('should do nothing with an empty string', () => {
            boundControl.value = '';

            directive.trimWhiteSpace();

            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should do nothing if string does not need to be trimmed', () => {
            boundControl.value = 'abcdefghijklmnop';

            directive.trimWhiteSpace();

            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should trim spaces from passed value', () => {
            const beforeStr = '    abcdefghi jklmnop  ';
            const afterStr = 'abcdefghi jklmnop';
            boundControl.value = beforeStr;

            directive.trimWhiteSpace();

            expect(boundControl.control.setValue).toHaveBeenCalledWith(afterStr);
        });
    });
});
