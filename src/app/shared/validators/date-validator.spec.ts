import {
    isValidDate,
    getMaxDayOfMonth,
    getAge,
    isValidAge,
    parseDate,
    isValidRange,
    dateValidator
} from './date-validator';

describe('DateValidator', () => {
    describe('getMaxDayOfMonth', () => {
        it('should give the expected values for non leap years', () => {
            expect(getMaxDayOfMonth(1, 2001)).toEqual(31);
            expect(getMaxDayOfMonth(2, 2001)).toEqual(28);
            expect(getMaxDayOfMonth(3, 2001)).toEqual(31);
            expect(getMaxDayOfMonth(4, 2001)).toEqual(30);
            expect(getMaxDayOfMonth(5, 2001)).toEqual(31);
            expect(getMaxDayOfMonth(6, 2001)).toEqual(30);
            expect(getMaxDayOfMonth(7, 2001)).toEqual(31);
            expect(getMaxDayOfMonth(8, 2001)).toEqual(31);
            expect(getMaxDayOfMonth(9, 2001)).toEqual(30);
            expect(getMaxDayOfMonth(10, 2001)).toEqual(31);
            expect(getMaxDayOfMonth(11, 2001)).toEqual(30);
            expect(getMaxDayOfMonth(12, 2001)).toEqual(31);
        });

        it('should give the expected values for leap years', () => {
            expect(getMaxDayOfMonth(1, 2000)).toEqual(31);
            expect(getMaxDayOfMonth(2, 2000)).toEqual(29);
            expect(getMaxDayOfMonth(3, 2000)).toEqual(31);
            expect(getMaxDayOfMonth(4, 2000)).toEqual(30);
            expect(getMaxDayOfMonth(5, 2000)).toEqual(31);
            expect(getMaxDayOfMonth(6, 2000)).toEqual(30);
            expect(getMaxDayOfMonth(7, 2000)).toEqual(31);
            expect(getMaxDayOfMonth(8, 2000)).toEqual(31);
            expect(getMaxDayOfMonth(9, 2000)).toEqual(30);
            expect(getMaxDayOfMonth(10, 2000)).toEqual(31);
            expect(getMaxDayOfMonth(11, 2000)).toEqual(30);
            expect(getMaxDayOfMonth(12, 2000)).toEqual(31);
        });
    });

    describe('isValidDate', () => {
        let testDate;

        beforeEach(() => {
            testDate = {
                month: 12,
                day: 12,
                year: 1980
            };
        });

        it('should return true for starting test date', () => {
            expect(isValidDate(testDate)).toBe(true);
        });

        describe('month', () => {
            it('should return false if month is less than 1', () => {
                testDate.month = 0;

                expect(isValidDate(testDate)).toBe(false);
            });

            it('should return false if month is greater than 12', () => {
                testDate.month = 13;

                expect(isValidDate(testDate)).toBe(false);
            });
        });

        describe('year', () => {
            it('should return false if year is less than 0', () => {
                testDate.year = -1980;

                expect(isValidDate(testDate)).toBe(false);
            });

            it('should return false if year is greater than 9999', () => {
                testDate.year = 10000;

                expect(isValidDate(testDate)).toBe(false);
            });
        });

        describe('day', () => {
            it('should return false if day is less than 1', () => {
                testDate.day = 0;

                expect(isValidDate(testDate)).toBe(false);
            });

            it(`should return false if day is greater than max day of it's month (non leap year)`, () => {
                for (testDate.month = 1; testDate.month < 13; testDate.month++) {
                    testDate.day = getMaxDayOfMonth(testDate.month, testDate.year);
                    expect(isValidDate(testDate)).toBe(true);

                    testDate.day++;
                    expect(isValidDate(testDate)).toBe(false);
                }
            });
        });
    });

    describe('getAge', () => {
        let today;
        let testDate;

        beforeEach(() => {
            today = new Date();
            testDate = new Date();
        });

        it('should give the correct age if the birthday is today', () => {
            testDate.setFullYear(today.getFullYear() - 21);

            expect(getAge(testDate)).toEqual(21);
        });

        it('should give the correct age if the birthday is at least a month before today', () => {
            testDate.setFullYear(today.getFullYear() - 21);
            testDate.setMonth(today.getMonth() - 1);

            expect(getAge(testDate)).toEqual(21);
        });

        it('should give the correct age if the birthday is at least a day before today', () => {
            testDate.setFullYear(today.getFullYear() - 21);
            testDate.setDate(today.getDate() - 1);

            expect(getAge(testDate)).toEqual(21);
        });

        it('should give the correct age if the birthday is at least a month after today', () => {
            testDate.setFullYear(today.getFullYear() - 21);
            testDate.setMonth(today.getMonth() + 1);

            expect(getAge(testDate)).toEqual(20);
        });

        it('should give the correct age if the birthday is at least a day after today', () => {
            testDate.setFullYear(today.getFullYear() - 21);
            testDate.setDate(today.getDate() + 1);

            expect(getAge(testDate)).toEqual(20);
        });
    });

    describe('isValidAge', () => {
        let today;
        let testDate;

        beforeEach(() => {
            today = new Date();
            testDate = {
                month: today.getMonth() + 1,
                day: today.getDate(),
                year: today.getFullYear()
            };
        });

        it('should return true if minAge is less than 0', () => {
            expect(isValidAge(testDate, -1)).toBe(true);
        });

        it('should return true if age is greater than minAge', () => {
            testDate.year -= 21;
            expect(isValidAge(testDate, 18)).toBe(true);
        });

        it('should return false if age is less than minAge', () => {
            testDate.year -= 17;
            expect(isValidAge(testDate, 18)).toBe(false);
        });

        it('should return false if age is equal to minAge', () => {
            testDate.year -= 18;
            expect(isValidAge(testDate, 18)).toBe(true);
        });
    });

    describe('parseDate', () => {
        let formatter;

        beforeEach(() => {
            formatter = {
                getUnformattedObject: jasmine.createSpy('getUnformattedObject')
            };
        });

        it('should return null if formatter failes to unformat date string', () => {
            const testDateStr = '12/abc';
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(null);

            expect(parseDate(testDateStr, formatter)).toBeNull();
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(testDateStr, true);
        });

        it('should return parsed date if formatter successfully unformat date string', () => {
            const testDateStr = '12/12/1980';
            const unformattedObj = {
                month: '12',
                day: '12',
                year: '1980'
            };
            const expectedParsedObj = {
                month: 12,
                day: 12,
                year: 1980
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(unformattedObj);

            const result = parseDate(testDateStr, formatter);

            expect(result.month).toEqual(expectedParsedObj.month);
            expect(result.day).toEqual(expectedParsedObj.day);
            expect(result.year).toEqual(expectedParsedObj.year);

            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(testDateStr, true);
        });
    });

    describe('isValidRange', () => {
        let today;
        let testDate;

        beforeEach(() => {
            today = new Date();
            testDate = {
                month: today.getMonth() + 1,
                day: today.getDate(),
                year: today.getFullYear()
            };
        });

        it('should return true if date is today', () => {
            expect(isValidRange(testDate, 1981)).toBe(true);
        });

        it('should return false if year is less than min year', () => {
            testDate.year = 1980;
            expect(isValidRange(testDate, 1981)).toBe(false);
        });

        it('should return false if date is after today', () => {
            testDate.day++;
            expect(isValidRange(testDate, 1981)).toBe(false);
        });

        it('should return true if date is greater than min year and before today', () => {
            testDate.day--;
            expect(isValidRange(testDate, 1981)).toBe(true);
        });
    });

    describe('dateValidator', () => {
        let formatter;
        let config;
        let validate;

        beforeEach(() => {
            formatter = {
                getUnformattedObject: jasmine.createSpy('getUnformattedObject')
            };
            config = {};
            validate = dateValidator(formatter, config);
        });

        it('should have created a funciton to validate the form control', () => {
            expect(validate).toBeTruthy();
        });

        it('should return null if the control value is empty', () => {
            const control = {
                value: ''
            };
            expect(validate(control)).toBeNull();
        });

        it('should return invalidDate validation object when date is not parsable', () => {
            const control = {
                value: '12/noparseparse'
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(null);

            const result = validate(control);

            expect(result.invalidDate).toEqual(true, 'invalidDate to be returned');
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(control.value, true);
        });

        it('should return invalidDate validation object when date is not real', () => {
            const control = {
                value: '3/32/1980'
            };
            const unformattedObj = {
                month: '3',
                day: '32',
                year: '1980'
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(unformattedObj);

            const result = validate(control);

            expect(result.invalidDate).toEqual(true, 'invalidDate to be returned');
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(control.value, true);
        });

        it('should return dateOutOfRange validation object when date is less than minYear', () => {
            config.minYear = 1980;
            const control = {
                value: '3/31/1979'
            };
            const unformattedObj = {
                month: '3',
                day: '31',
                year: '1979'
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(unformattedObj);

            const result = validate(control);

            expect(result.dateOutOfRange).toEqual(true, 'dateOutOfRange to be returned');
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(control.value, true);
        });

        it('should return dateOutOfRange validation object when date is later than today', () => {
            config.minYear = new Date().getFullYear();
            const control = {
                value: `3/31/${config.minYear + 1}`
            };
            const unformattedObj = {
                month: '3',
                day: '31',
                year: `${config.minYear + 1}`
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(unformattedObj);

            const result = validate(control);

            expect(result.dateOutOfRange).toEqual(true, 'dateOutOfRange to be returned');
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(control.value, true);
        });

        it('should return invalidAge validation object when age is less than minAge', () => {
            config.minAge = 18;
            const today = new Date();
            const control = {
                value: `01/01/${today.getFullYear() - 17}`
            };
            const unformattedObj = {
                month: '01',
                day: '01',
                year: `${today.getFullYear() - 17}`
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(unformattedObj);

            const result = validate(control);

            expect(result.invalidAge).toEqual(true, 'invalidAge to be returned');
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(control.value, true);
        });

        it('should return null with valid date', () => {
            config.minAge = 18;
            config.minYear = 1980;
            const control = {
                value: `01/01/1980`
            };
            const unformattedObj = {
                month: '01',
                day: '01',
                year: `1980`
            };
            formatter.getUnformattedObject = jasmine.createSpy('getUnformattedObject').and.returnValue(unformattedObj);

            const result = validate(control);

            expect(result).toBeNull();
            expect(formatter.getUnformattedObject).toHaveBeenCalledWith(control.value, true);
        });
    });
});
