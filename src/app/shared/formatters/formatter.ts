export interface Formatter {
    format(value: string): string;

    removeUnimportantChars(value: string): string;
}
