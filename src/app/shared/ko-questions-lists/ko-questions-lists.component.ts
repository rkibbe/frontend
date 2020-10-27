import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'verti-ko-questions-lists',
    templateUrl: './ko-questions-lists.component.html',
    styleUrls: ['./ko-questions-lists.component.scss']
})
export class KoQuestionsListsComponent implements OnInit, OnChanges {
    @Input('koTitleData') koTitleData: string;
    @Input('koSubTitleData') koSubTitleData: string;
    @Input('koListTitleData') koListTitleData: string;
    @Input('koListData') koListData: string[];
    constructor() {}

    ngOnInit() {
        // this.koListData = [];
    }

    ngOnChanges(changes) {
        // this.koSubTitleData = changes.koSubTitleData.currentValue;
    }
}
