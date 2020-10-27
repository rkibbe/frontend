import { VinInputDirective } from './vin-input.directive';

describe('VinInputDirective', () => {
    describe('blockInvalidCharacters', () => {
        let directive: VinInputDirective;
        let boundControl;
        const event = new Event('input');
        beforeEach(() => {
            boundControl = {
                value: '',
                control: {
                    setValue: jasmine.createSpy('setValue')
                }
            };
            directive = new VinInputDirective(boundControl);
        });

        it('should create an instance blockInvalidCharacters', () => {
            expect(directive).toBeTruthy();
        });

        it('should not modify an empty value', () => {
            boundControl.value = '';
            directive.blockInvalidCharacters(event);
            expect(boundControl.control.setValue).not.toHaveBeenCalled();
        });

        it('should only keep letters, spaces, dashes, and apostrophes, and remove other characters', () => {
            const beforeStr = `1a2B3c4d5e6f7g8h9i0jklmnopqrstuvwxyz`;
            const beforeStrUppr = beforeStr.toUpperCase();
            boundControl.value = beforeStr;
            directive.blockInvalidCharacters(event);
            expect(boundControl.control.setValue).toHaveBeenCalledWith(beforeStrUppr);
        });
    });

    describe('removeError', () => {
        let directive: VinInputDirective;
        let boundControl;

        beforeEach(() => {
            boundControl = {
                value: '',
                control: {
                    setErrors: jasmine.createSpy('setErrors')
                },
                errors: 'error'
            };
            directive = new VinInputDirective(boundControl);
        });

        it('should create an instance removeError', () => {
            expect(directive).toBeTruthy();
        });

        it('should do nothing in removeError with an empty string', () => {
            boundControl.value = '';
            directive.removeError(event);
            expect(boundControl.control.setErrors).toHaveBeenCalled();
        });
        it('should do value with 17 chars string', () => {
            boundControl.value = '123D4589HW34UT4';
            directive.removeError(event);
            expect(boundControl.control.setErrors).toHaveBeenCalled();
        });
        it('should pass null value', () => {
            boundControl.value = null;
            directive.removeError(event);
            expect(boundControl.control.setErrors).toHaveBeenCalled();
        });
        it('should pass errors string', () => {
            boundControl.errors = 'errors';
            directive.removeError(event);
            expect(boundControl.control.setErrors).toHaveBeenCalled();
        });
    });

    describe('trimWhiteSpace', () => {
        let directive: VinInputDirective;
        let boundControl;

        beforeEach(() => {
            boundControl = {
                value: '',
                control: {
                    setErrors: jasmine.createSpy('setErrors')
                }
            };
            directive = new VinInputDirective(boundControl);
        });

        it('should create an instance trimWhiteSpace', () => {
            expect(directive).toBeTruthy();
        });

        it('should do nothing with trimWhiteSpace an empty string', () => {
            boundControl.value = '';
            directive.trimWhiteSpace(event);
            expect(boundControl.control.setErrors).not.toHaveBeenCalled();
        });

        it('should do nothing if string does not need to be trimmed', () => {
            boundControl.value = '12F45A789012F45A';
            directive.trimWhiteSpace(event);
            expect(boundControl.control.setErrors).toHaveBeenCalled();
        });
    });
});
