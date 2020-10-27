import { Component, OnInit, OnDestroy } from '@angular/core';

import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';

@Component({
    selector: 'verti-nonadpf-cta',
    templateUrl: './nonadpf-cta.component.html',
    styleUrls: ['./nonadpf-cta.component.scss']
})
export class NonadpfCtaComponent implements OnInit, OnDestroy {
    imgSource: string;
    title: string;
    private _firstName: string;

    set firstName(firstName: string) {
        this._firstName = firstName || '';
        this.title = 'Sorry, ' + this._firstName + ' we need to talk this through.';
    }

    get firstName(): string {
        return this._firstName;
    }

    leadSub: Subscription;
    contactNumber: string;
    constructor(
        private store: Store<any>
    ) {
        this.imgSource = './assets/img/Fill_1.svg';
        this.firstName = '';
    }
    ngOnInit() {
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.firstName = leadData.firstName;
            });
        this.contactNumber = VERTI_CONTACT_NUMBERS.NONADPFCTA;
    }
    ngOnDestroy() {
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
    }
}
