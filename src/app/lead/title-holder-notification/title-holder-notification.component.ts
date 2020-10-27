import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdditionalInterest, Address, LienHolder, TitleHolder, Vehicle } from '@app/store/models/lead.model';
import { LienHolderService } from '@services/lien-holder.service';
import { NavigationService } from '@services/navigation.service';
import { TitleHolderContactService } from '@services/title-holder-contact.service';
import { TrilliumAddressService } from '@services/trillium-address.service';
import { AddressInputLabelConfig } from '@shared/address-input/address-input.component';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'verti-title-holder-notification',
    templateUrl: './title-holder-notification.component.html',
    styleUrls: ['./title-holder-notification.component.scss']
})
export class TitleHolderNotificationComponent implements OnInit, OnDestroy {
    private titleHolder: TitleHolder;

    public get ADDRESS_LABEL_CONFIG(): AddressInputLabelConfig {
        return {
            autofill: {
                main: this.titleHolder === TitleHolder.LEASE ? 'Dealer address' : 'Bank address'
            }
        };
    }

    public get NAME_LABEL(): string {
        return this.titleHolder === TitleHolder.LEASE ? 'Dealer name' : 'Bank name';
    }

    public form: FormGroup;
    private addressControl: FormControl;

    private get lienHolderControl(): FormControl {
        return this.form.get('lienHolder') as FormControl;
    }

    private lienHolders: LienHolder[];
    public filteredLienHolders$: Observable<LienHolder[]> = of([]);

    private timeoutModalCounter = 0;

    private ngDestroy$ = new Subject();
    private publicId: string;
    vehiclesList = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
    vehicleIconUri: string;
    vehicle: Vehicle;
    constructor(
        private lienHolderService: LienHolderService,
        private trilliumService: TrilliumAddressService,
        private navService: NavigationService,
        private titleHolderContactService: TitleHolderContactService
    ) { }

    ngOnInit() {
        this.buildForm();

        this.getLienHolderOptions();
        this.lienHolderControl.valueChanges
            .pipe(filter(value => typeof value !== 'string'))
            .subscribe(this.updateAddressOnLienHolderChange.bind(this));

        this.titleHolderContactService.vehicleObservable.pipe(takeUntil(this.ngDestroy$)).subscribe(vehicle => {
            this.resetFormForNewVehicle();
            this.titleHolder = this.titleHolderContactService.getCurrentTitleHolder();
            this.prefillDefaultValues(vehicle);
            // tslint:disable-next-line: max-line-length
            this.publicId = vehicle.additionalInterests && vehicle.additionalInterests.length ? vehicle.additionalInterests[0].publicID : null;
            this.vehicle = vehicle;
            this.vehicleIconUri = `assets/img/${
                this.vehiclesList.includes(vehicle.bodyStyleCode) ? vehicle.bodyStyleCode : 'SD'
                }.svg`;
        });
        this.navService.upDateMarketingData();

    }
    resetFormForNewVehicle() {
        this.titleHolderContactService.ignoreDirtyAfterGoogleSuggestion = true;

        this.lienHolderControl.setValue('');
        this.addressControl.setValue('');
    }
    buildForm() {
        this.addressControl = new FormControl(null, Validators.required);

        this.form = new FormGroup({
            lienHolder: new FormControl(null, Validators.compose([Validators.required, Validators.pattern(/\S+/)])),
            address: this.addressControl
        });
    }

    prefillDefaultValues(vehicle: Vehicle) {
        if (
            (vehicle.isQuoteVehicle || this.navService.currentRouteObj.preFill) &&
            vehicle.additionalInterests &&
            vehicle.additionalInterests.length
        ) {
            const interest: AdditionalInterest = vehicle.additionalInterests[0];
            if (interest.additionalInterestType === this.titleHolder) {
                const holder: LienHolder = {
                    name: interest.contactName,
                    address: {
                        addressLine1: interest.addressLine1,
                        addressLine2: interest.addressLine2,
                        city: interest.city,
                        state: interest.state,
                        postalCode: interest.postalCode,
                        country: interest.country,
                        isAddressVerified: interest.isAddressVerified
                    }
                };

                this.lienHolderControl.setValue(holder);
            }
        }
    }

    updateAddressOnLienHolderChange(holder: LienHolder): void {
        this.addressControl.setValue(holder.address);
    }

    getLienHolderOptions() {
        this.lienHolderService
            .getLienHolders()
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(holders => {
                this.lienHolders = holders || [];
                this.filteredLienHolders$ = this.lienHolderControl.valueChanges.pipe(
                    startWith<string | LienHolder>(''),
                    map(value => (typeof value === 'string' ? value : value.name)),
                    map(name => (name ? this.filterLienHolders(name) : this.lienHolders.slice()))
                );
            });
    }

    filterLienHolders(search: string): LienHolder[] {
        const searchChars = search.toLowerCase().replace(/\W/g, '');

        return this.lienHolders.filter(holder => {
            if (holder.name) {
                let name = holder.name.toLowerCase();
                for (let i = 0; i < searchChars.length; ++i) {
                    const searchI = name.indexOf(searchChars.charAt(i));
                    if (searchI === -1) {
                        return false;
                    }
                    name = name.substr(searchI + 1);
                }

                return true;
            }
        });
    }

    displayFn(lienHolder?: LienHolder): string | undefined {
        return lienHolder ? lienHolder.name : undefined;
    }

    // handlers
    onSubmit(): void {
        (this.addressControl.value as Observable<Address>)
            .pipe(
                this.navService.timeoutThenRouteToSystemFailure(_ => this.timeoutModalCounter++ < 3),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(this.saveContactInfoAndContinue.bind(this));
    }

    private saveContactInfoAndContinue(address: Address): void {
        const lienHolderVal = this.lienHolderControl.value;

        this.titleHolderContactService.continue({
            contactName: typeof lienHolderVal === 'string' ? lienHolderVal.trim() : lienHolderVal.name,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
            additionalInterestType: this.titleHolder,
            isAddressVerified: address.isAddressVerified,
            publicID: this.publicId
        });
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}
