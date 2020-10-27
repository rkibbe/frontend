import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VERTI_CONTACT_NUMBERS } from '../constants';
import { WalmericDialogModalComponent } from '../walmeric-dialog-modal/walmeric-dialog-modal.component';
@Component({
    selector: 'verti-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
    @Input('routeName') routeName;
    private ngDestroy$ = new Subject();
    logoPath: string;
    noLogoSource: boolean;
    ifCompVisible: boolean;
    ifQuoteVisible: boolean;
    firstName: string;
    lastName: string;
    leadSub: Subscription;
    showName: boolean;
    // appSettings: AppSettings;
    contactNumber: string;
    constructor(public dialog: MatDialog, private store: Store<any>, private appSettingService: AppSettingsService) {
        this.noLogoSource = false;
        this.ifCompVisible = false;
        this.ifQuoteVisible = false;
        this.firstName = '';
        this.lastName = '';
        this.showName = true;
        // this.appSettingService.getSettings().subscribe(appSettings => {
        //     this.appSettings = appSettings;
        // });
    }
    ngOnInit() {
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe((leadData: Lead) => {
                if (leadData.firstName) {
                    this.firstName = leadData.firstName;
                    this.lastName = leadData.lastName.charAt(0);
                }
            });
    }
    ngOnChanges() {
        this.showName = this.routeName !== 'quotes';
        const allContactNumbers = VERTI_CONTACT_NUMBERS;
        const route = (this.routeName || '').toUpperCase();
        const contactNumForCurrentRoute = allContactNumbers[route];
        this.contactNumber = contactNumForCurrentRoute ? contactNumForCurrentRoute : allContactNumbers['DEFAULT'];
    }
    openDialog(): void {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }

    ngOnDestroy() {
        this.ngDestroy$.next();
    }
}
