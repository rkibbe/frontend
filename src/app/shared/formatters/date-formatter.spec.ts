import { DateFormatter } from './date-formatter';

describe('DateFormatter', () => {
    let dateFormatter: DateFormatter;

    beforeEach(() => {
        dateFormatter = new DateFormatter();
    });

    describe('modifyOrPadValue', () => {
        it('should do nothing if passed value is less than max number', () => {
            const testStrs = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            for (const testStr of testStrs) {
                const result = dateFormatter.modifyOrPadValue(testStr, 12);

                expect(result).toEqual(testStr);
            }
        });

        it(`should return '1' if non number entry is passed`, () => {
            const testStr = 'a1';

            const result = dateFormatter.modifyOrPadValue(testStr, 12);

            expect(result).toEqual('1');
        });

        it(`should return '1' if all digits are 0`, () => {
            const testStr = '00';

            const result = dateFormatter.modifyOrPadValue(testStr, 12);

            expect(result).toEqual('1');
        });

        it(`should return '1' if value passed is larger than max amount`, () => {
            const testStr = '13';

            const result = dateFormatter.modifyOrPadValue(testStr, 12);

            expect(result).toEqual('1');
        });

        it(`should return '1' if value passed is negative`, () => {
            const testStr = '-1';

            const result = dateFormatter.modifyOrPadValue(testStr, 12);

            expect(result).toEqual('1');
        });

        it(`should do nothing to undetermined values`, () => {
            expect(dateFormatter.modifyOrPadValue('0', 12)).toEqual('0');
            expect(dateFormatter.modifyOrPadValue('1', 12)).toEqual('1');
        });

        it(`should pad number with zero if it's guaranteed to be over the max amount in the future`, () => {
            expect(dateFormatter.modifyOrPadValue('2', 12)).toEqual('02');
        });
    });

    describe('modifyOrPadDateValues', () => {
        it('should do nothing with empty string', () => {
            expect(dateFormatter.modifyOrPadDateValues('')).toEqual('');
        });

        it('should modify month when present', () => {
            const testStr = '2';

            expect(dateFormatter.modifyOrPadDateValues(testStr)).toEqual('02');
        });

        it('should modify day when present', () => {
            const testStr = '0233';

            expect(dateFormatter.modifyOrPadDateValues(testStr)).toEqual('021');
        });

        it('should not modify year when present', () => {
            const testStr = '02311987';

            expect(dateFormatter.modifyOrPadDateValues(testStr)).toEqual('02311987');
        });
    });

    describe('format', () => {
        it(`should remove all non digit characters and format digits`, () => {
            expect(dateFormatter.format('ab1sdf2as2..3,1=980')).toEqual('12/23/1980');
        });
    });

    describe('insertSpecialChars', () => {
        it('should do nothing with an empty string', () => {
            expect(dateFormatter.format('')).toEqual('');
        });

        it(`should add '/' when month section is filled`, () => {
            expect(dateFormatter.format('1')).toEqual('1');
            expect(dateFormatter.format('12')).toEqual('12/');
        });

        it(`should add '/' between month and day sections are filled`, () => {
            expect(dateFormatter.format('12/2')).toEqual('12/2');
            expect(dateFormatter.format('12/23')).toEqual('12/23/');
        });

        it(`should add year when section is filled`, () => {
            expect(dateFormatter.format('12/23/1')).toEqual('12/23/1');
            expect(dateFormatter.format('12/23/19')).toEqual('12/23/19');
            expect(dateFormatter.format('12/23/198')).toEqual('12/23/198');
            expect(dateFormatter.format('12/23/1980')).toEqual('12/23/1980');
        });

        it(`should remove extra characters that extend date format`, () => {
            expect(dateFormatter.format('12/23/19809')).toEqual('12/23/1980');
        });
    });

    describe('getUnformattedObject', () => {
        describe('strict', () => {
            it('should return null for non complete date', () => {
                expect(dateFormatter.getUnformattedObject('12/31/19', true)).toBeNull();
            });

            it('should return object with month, day, year matching passed values', () => {
                const testStr = '12/31/1980';
                const expectedMonth = '12';
                const expectedDay = '31';
                const expectedYear = '1980';

                const result = dateFormatter.getUnformattedObject(testStr, true);
                expect(result).not.toBeNull();
                expect(result.month).toEqual(expectedMonth);
                expect(result.day).toEqual(expectedDay);
                expect(result.year).toEqual(expectedYear);
            });
        });

        describe('not strict', () => {
            it('should return object with undefined date values when empty string is passed', () => {
                const result = dateFormatter.getUnformattedObject('');
                expect(result.month).toBeUndefined();
                expect(result.day).toBeUndefined();
                expect(result.year).toBeUndefined();
            });

            it('should return object with month value, and others undefined', () => {
                const testStr = '1';
                const expectedMonth = '1';

                const result = dateFormatter.getUnformattedObject(testStr);
                expect(result.month).toEqual(expectedMonth);
                expect(result.day).toBeUndefined();
                expect(result.year).toBeUndefined();
            });

            it('should return object with month and day values, and year undefined', () => {
                const testStr = '12/21/';
                const expectedMonth = '12';
                const expectedDay = '21';

                const result = dateFormatter.getUnformattedObject(testStr);
                expect(result.month).toEqual(expectedMonth);
                expect(result.day).toEqual(expectedDay);
                expect(result.year).toBeUndefined();
            });

            it('should return object with month, day, year matching passed values', () => {
                const testStr = '12/31/198';
                const expectedMonth = '12';
                const expectedDay = '31';
                const expectedYear = '198';

                const result = dateFormatter.getUnformattedObject(testStr);
                expect(result).not.toBeNull();
                expect(result.month).toEqual(expectedMonth);
                expect(result.day).toEqual(expectedDay);
                expect(result.year).toEqual(expectedYear);
            });
        });
    });
});
