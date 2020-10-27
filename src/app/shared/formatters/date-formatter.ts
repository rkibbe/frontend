import { Formatter } from './formatter';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateFormatter implements Formatter {
    readonly MONTH_GROUP = 1;
    readonly DAY_GROUP = 2;
    readonly YEAR_GROUP = 3;

    readonly STRICT_DOB_PATTERN = /^(\d{2})(\d{2})(\d{4})$/;
    readonly PARTIAL_DOB_PATTERN = /(\d{1,2})?(\d{1,2})?(\d{1,4})?/;

    constructor() {}

    /**
     * Splits and adjusts date values if necessary
     *
     * @param strippedStr String with invalid characters stripped to be adjusted
     */
    modifyOrPadDateValues(strippedStr: string): string {
        const dobGroups = this.getUnformattedObject(strippedStr);

        if (dobGroups.month) {
            dobGroups.month = this.modifyOrPadValue(dobGroups.month, 12);
        }

        if (dobGroups.day) {
            dobGroups.day = this.modifyOrPadValue(dobGroups.day, 31);
        }

        return (dobGroups.month || '') + (dobGroups.day || '') + (dobGroups.year || '');
    }

    /**
     * Adjusts string value depending on the passed max value:
     *      -returns '1' if str is NaN value, exceeds max, or <= 0 (only checks for 0 when all digits have been filled
     *       e.g. ('0', 10) => '0', ('00', 10) => '1')
     *      -pads value with zeroes if current value is guaranteed to pass max value e.g. ('1', 10) => '1', ('2', 10) => '02'
     *
     * @param str String value to adjust
     * @param max Max value the passed string can be
     */
    modifyOrPadValue(str: string, max: number): string {
        if (str.charAt(0) !== '0' || str === '00') {
            let num = +str;
            if (isNaN(num) || num <= 0 || num > max) {
                num = 1;
            }
            str = num > +max.toString().charAt(0) && num.toString().length === 1 ? '0' + num : num.toString();
        }

        return str;
    }

    /**
     * Strips invalid characters, adjusts date values, and formats result to date string
     *
     * @param value Value to be formatted
     */
    format(value: string): string {
        value = this.removeUnimportantChars(value);
        value = this.modifyOrPadDateValues(value);
        value = this.insertSpecialChars(value);

        return value;
    }

    /**
     * Removes all non digit characters
     *
     * @param value Value to be stripped
     */
    removeUnimportantChars(value: string) {
        return value.replace(/\D/g, '');
    }

    /**
     * Inputs '/' between completed date sections
     *
     * @param strippedStr String with invalid characters stripped to be adjusted
     */
    insertSpecialChars(strippedValue: string) {
        if (!strippedValue) {
            return strippedValue;
        }

        if (strippedValue.length <= 1) {
            strippedValue = strippedValue.replace(/^(\d{2})?/, '$1');
        } else if (strippedValue.length <= 3) {
            strippedValue = strippedValue.replace(/^(\d{2})(\d{0,2})?/, '$1/$2');
        } else {
            strippedValue = strippedValue.substring(0, 8);
            strippedValue = strippedValue.replace(/^(\d{2})(\d{2})(\d{0,4})?/, '$1/$2/$3');
        }

        return strippedValue;
    }

    /**
     * Splits a formatted date string into an object with month, day, and year
     *
     * @param date Formatted date string
     * @param strict Flag whether it should look for full date or partial, false by default
     */
    getUnformattedObject(date: string, strict: boolean = false): UnformattedDate {
        date = this.removeUnimportantChars(date);

        let dobGroups;

        if (strict) {
            dobGroups = this.STRICT_DOB_PATTERN.exec(date);

            if (!dobGroups) {
                return null;
            }
        } else {
            dobGroups = this.PARTIAL_DOB_PATTERN.exec(date);
        }

        return {
            day: dobGroups[this.DAY_GROUP],
            month: dobGroups[this.MONTH_GROUP],
            year: dobGroups[this.YEAR_GROUP]
        };
    }
}

export interface UnformattedDate {
    day: string;
    month: string;
    year: string;
}
