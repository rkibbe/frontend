import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TitleHolder, Vehicle } from '@app/store/models/lead.model';
import { NavigationService } from '@services/navigation.service';
import { TitleHolderService } from '@services/title-holder.service';
import { TitleHolderModalComponent } from '@shared/title-holder-modal/title-holder-modal.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WalmericDialogModalComponent } from '../../core/walmeric-dialog-modal/walmeric-dialog-modal.component';

@Component({
    selector: 'verti-title-holder-select',
    templateUrl: './title-holder-select.component.html',
    styleUrls: ['./title-holder-select.component.scss']
})
export class TitleHolderSelectComponent implements OnInit, OnDestroy {
    vehicle: Vehicle;

    // TODO move this list to a constants file since it's needed in vehicle summary as well
    vehiclesList = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
    titleHolderOptions: Array<TitleHolderOption> = [
        {
            type: TitleHolder.OWNED,
            name: 'I DO \u2014 (OWNED)'
        },
        {
            type: TitleHolder.LOAN,
            name: 'A BANK \u2014 (LOAN)'
        },
        {
            type: TitleHolder.LEASE,
            name: 'A DEALER \u2014 (LEASE)'
        },
        {
            type: TitleHolder.COMPANY,
            name: 'A COMPANY / FLEET'
        },
        {
            type: TitleHolder.TRUST,
            name: 'A TRUST'
        },
        {
            type: TitleHolder.UNKNOWN,
            name: `I DON'T KNOW`
        }
    ];

    selectControl: FormControl;

    vehicleIconUri: string;

    private ngDestroy$ = new Subject();

    constructor(
        public dialog: MatDialog,
        private navService: NavigationService,
        private titleHolderService: TitleHolderService
    ) { }

    ngOnInit() {
        this.selectControl = new FormControl('', Validators.required);

        this.titleHolderService.vehicleObservable.pipe(takeUntil(this.ngDestroy$)).subscribe(vehicle => {
            this.vehicle = vehicle;
            this.vehicleIconUri = `assets/img/${
                this.vehiclesList.includes(this.vehicle.bodyStyleCode) ? this.vehicle.bodyStyleCode : 'SD'
                }.svg`;
            this.selectControl.reset();
            this.setDefaultValues();
        });
        this.navService.upDateMarketingData();
    }

    setDefaultValues() {
        if (this.vehicle.isQuoteVehicle || this.navService.currentRouteObj.preFill) {
            if (this.vehicle.owned) {
                this.selectControl.setValue(TitleHolder.OWNED);
            } else if (this.vehicle.titleHolder === TitleHolder.LEASE) {
                this.selectControl.setValue(TitleHolder.LEASE);
            } else if (this.vehicle.titleHolder === TitleHolder.LOAN) {
                this.selectControl.setValue(TitleHolder.LOAN);
            }
        }
    }

    onButtonToggleClick(holder: TitleHolder) {
        if (holder === TitleHolder.LOAN || holder === TitleHolder.LEASE || holder === TitleHolder.OWNED) {
            this.titleHolderService.continue(holder);
        } else {
            this.openTitleHolderModal(holder);
        }
    }

    openTitleHolderModal(holder: TitleHolder) {
        this.dialog
            .open(TitleHolderModalComponent, {
                data: holder,
                panelClass: 'title-holder-modal-panel'
            })
            .afterClosed()
            .subscribe(shouldContact => {
                if (shouldContact) {
                    this.openWalmericModal();
                }
            });
    }

    openWalmericModal() {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}

interface TitleHolderOption {
    type: TitleHolder;
    name: string;
}
