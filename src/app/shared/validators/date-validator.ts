import { FormControl, ValidatorFn } from '@angular/forms';
import { DateFormatter } from '../formatters/date-formatter';

export function dateValidator(formatter: DateFormatter, config?: DateValidatorConfig): ValidatorFn {
    return (control: FormControl) => {
        const minAge = config && config.minAge >= 0 ? config.minAge : -1;
        const minYear = (config && config.minYear) || 1900;

        if (control.value) {
            const parsedDate = parseDate(control.value, formatter);
            if (!parsedDate || !isValidDate(parsedDate)) {
                return { invalidDate: true };
            } else if (!isValidRange(parsedDate, minYear)) {
                return { dateOutOfRange: true };
            } else if (!isValidAge(parsedDate, minAge)) {
                return { invalidAge: true };
            }
        }

        return null;
    };
}

export interface DateValidatorConfig {
    minAge?: number;
    minYear?: number;
}

export function isValidDate(parsedDate: ParsedDate): boolean {
    const { day, month, year } = parsedDate;

    // Check the ranges of month and year
    if (year < 0 || year > 9999 || month <= 0 || month > 12) {
        return false;
    }

    const maxDay = getMaxDayOfMonth(month, year);

    // Check the range of the day
    return day > 0 && day <= maxDay;
}

export function getMaxDayOfMonth(month, year) {
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29;
    }

    return monthLength[month - 1];
}

export function isValidAge(parsedDate: ParsedDate, minAge: number): boolean {
    if (minAge < 0) {
        return true;
    }

    const { month, day, year } = parsedDate;

    const age = getAge(new Date(year, month - 1, day));

    return age >= minAge;
}

export function getAge(dob: Date): number {
    const today = new Date();
    const m = today.getMonth() - dob.getMonth();

    let age = today.getFullYear() - dob.getFullYear();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
}

export function isValidRange(parsedDate: ParsedDate, minYear: number) {
    const { day, month, year } = parsedDate;
    return year >= minYear && new Date(year, month - 1, day) <= new Date();
}

export function parseDate(date: string, formatter: DateFormatter): ParsedDate {
    const dob = formatter.getUnformattedObject(date, true);

    if (!dob) {
        return null;
    }

    return {
        day: +dob.day,
        month: +dob.month,
        year: +dob.year
    };
}

export interface ParsedDate {
    day: number;
    month: number;
    year: number;
}
