import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NavigationService } from '@services/navigation.service';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take } from 'rxjs/operators';
import { Lead } from '@app/store/models/lead.model';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { MatDialog } from '@angular/material';
@Component({
    selector: 'verti-payment-success',
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
    imgSource: string;
    title: string;
    subtitle: string;
    lead: Lead;
    constructor(private navService: NavigationService, private store: Store<any>, private dialog: MatDialog) {
        this.imgSource = './assets/img/Welcome_Icon.svg';
        this.title = 'Welcome to Verti!';
        this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((lead: Lead) => {
                this.lead = lead;
            });
    }
    ngOnInit() { }
    goToSidekick() {
        if (this.lead && this.lead.enterprisePartyID) {
            let url: string;
            if (this.lead.vertimode === 'sidekick') {
                url = environment.sidekickUrl + '=' + this.lead.enterprisePartyID;
            } else {
                url = environment.konyUrl;
            }
            this.navService.gotoUrl(url);
        } else {
            this.errorHandler();
        }
    }
    errorHandler() {
        this.dialog.open(TimeoutModalComponent, {
            panelClass: 'custom-timeout-modal'
        });
    }
}
