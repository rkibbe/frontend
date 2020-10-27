import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'verti-recovered-quote-summary-item',
    templateUrl: './recovered-quote-summary-item.component.html',
    styleUrls: ['./recovered-quote-summary-item.component.scss']
})
export class RecoveredQuoteSummaryItemComponent implements OnInit {
    @Output() continueQuote = new EventEmitter();

    @Input() quote;
    @Input() isPreviousQuote = true;

    constructor() { }

    ngOnInit() { }

    getQuoteTimestamp(): string {
        // TODO format timestamp
        return this.quote.timestamp;
    }

    getQuoteNumber(): string {
        // TODO format id if needs be
        return this.quote.isQuickQuote ? this.quote.quickQuoteNumber : this.quote.quoteNumber;
    }

    getQuotePrice(): string {
        if (this.quote.price || this.quote.price === 0) {
            return 'Estimated monthly cost: $' + this.quote.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }

        return 'Final price pending';
    }

    getQuoteNames(): string {
        // return this.quote.names.join(' & ');
        return this.quote.names;
    }

    getQuoteCars(): string {
        // return this.quote.cars.join(' & ');
        return this.quote.cars;
    }

    onContinueQuoteClick(): void {
        this.continueQuote.emit(this.quote);
    }
}
