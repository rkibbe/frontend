import { Component, forwardRef, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators,
    ValidatorFn
} from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Subject, Subscription, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { CitiesListService } from '@services/cities-list.service';
import { Address } from '@app/store/models/lead.model';
import { TrilliumAddressService } from '@services/trillium-address.service';
import { poBoxValidator } from '@shared/validators/po-box-validator';

@Component({
    selector: 'verti-manual-address',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ManualAddressComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ManualAddressComponent),
            multi: true
        }
    ],
    templateUrl: './manual-address.component.html',
    styleUrls: ['./manual-address.component.scss']
})
export class ManualAddressComponent implements ControlValueAccessor, OnInit, OnDestroy {
    private readonly DEFAULT_LABEL_CONFIG: ManualAddressLabelConfig = {
        addressLine1: 'Address line 1',
        addressLine2: 'Address line 2 (optional)',
        city: 'Select City',
        state: 'Select State',
        postalCode: 'Zip code'
    };
    @Input() labelConfig: ManualAddressLabelConfig = {};
    @Input() placeholderConfig: ManualAddressLabelConfig = {};
    @Input() trilliumVerification = false;
    @Input() allowPOBox = true;

    _readonly = false;
    public get readonly(): boolean {
        return this._readonly;
    }
    @Input('readonly')
    public set readonly(readonly: boolean) {
        if (this.form) {
            const func = readonly ? 'disable' : 'enable';
            if (this.stateControl) {
                this.stateControl[func]();
            }
            if (this.cityControl) {
                this.cityControl[func]();
            }
        }
        this._readonly = readonly;
    }

    @ViewChild('city') citySelect: MatSelect;

    form: FormGroup;

    get addressLine1Control(): FormControl {
        return this.form.get('addressLine1') as FormControl;
    }

    get addressLine2Control(): FormControl {
        return this.form.get('addressLine2') as FormControl;
    }

    get cityControl(): FormControl {
        return this.form.get('city') as FormControl;
    }

    get stateControl(): FormControl {
        return this.form.get('state') as FormControl;
    }

    get postalCodeControl(): FormControl {
        return this.form.get('postalCode') as FormControl;
    }

    possibleZipLocations$: Subscription;
    possibleZipLocations = [];
    get possibleStates(): string[] {
        return Array.from(new Set(this.possibleZipLocations.map(loc => loc.stateCode)));
    }
    get possibleCities(): string[] {
        return this.possibleZipLocations
            .filter(city => this.stateControl.value && city.stateCode === this.stateControl.value)
            .map(loc => loc.cityName);
    }

    lastPropagated: any;

    ngDestroy$ = new Subject();

    constructor(private citiesListService: CitiesListService, private trilliumService: TrilliumAddressService) {}

    propagateChange: Function = () => {};

    ngOnInit() {
        this.labelConfig = { ...this.DEFAULT_LABEL_CONFIG, ...this.labelConfig };
        this.placeholderConfig = { ...this.DEFAULT_LABEL_CONFIG, ...this.placeholderConfig };

        this.initalizeForm();

        this.postalCodeControl.valueChanges.subscribe(this.updatePostalCode.bind(this));

        this.form.valueChanges.subscribe(() => {
            this.lastPropagated = this.form.valid ? this.getAddress() : null;
            this.propagateChange(this.lastPropagated);
        });
    }

    private initalizeForm(): void {
        const addressLine1Validators: ValidatorFn[] = [Validators.required, Validators.pattern(/\S+/)];
        if (!this.allowPOBox) {
            addressLine1Validators.push(poBoxValidator());
        }

        this.form = new FormGroup({
            addressLine1: new FormControl('', addressLine1Validators),
            addressLine2: new FormControl(''),
            city: new FormControl({ value: '', disabled: this.readonly }, [
                Validators.required,
                Validators.pattern(/\S+/)
            ]),
            state: new FormControl({ value: '', disabled: this.readonly }, [
                Validators.required,
                Validators.pattern(/\S+/)
            ]),
            postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)])
        });
    }

    private updatePostalCode(origValue: string) {
        const postalCode = origValue.replace(/\D/g, '').substr(0, 5);

        if (postalCode !== origValue) {
            this.postalCodeControl.setValue(postalCode);
        }

        if (postalCode.length === 5) {
            if (this.postalCodeControl.dirty) {
                this.form.patchValue({
                    state: '',
                    city: ''
                });
            }

            if (this.possibleZipLocations$) {
                this.possibleZipLocations$.unsubscribe();
            }

            this.possibleZipLocations$ = this.citiesListService
                .getCitiesList(postalCode)
                .pipe(takeUntil(this.ngDestroy$))
                .subscribe((res: any) => {
                    this.possibleZipLocations = (res && res.apiOutput && res.apiOutput.result) || [];
                    if (this.possibleZipLocations.length) {
                        this.stateControl.setValue(this.possibleStates[0]);
                        this.updateCityFromPossibleLocations();
                    } else {
                        this.postalCodeControl.setErrors({ postalCode: true });
                    }
                });
        }
    }

    private updateCityFromPossibleLocations(): void {
        if (this.possibleZipLocations.length === 1) {
            this.cityControl.setValue(this.possibleCities[0]);
        } else {
            let citySet = false;
            if (this.postalCodeControl.pristine && this.cityControl.value) {
                const currCity = this.possibleCities.find(
                    poss => poss.toUpperCase() === this.cityControl.value.toUpperCase()
                );
                if (currCity) {
                    citySet = true;
                    this.cityControl.setValue(currCity);
                }
            }

            if (!citySet) {
                this.cityControl.setValue('');
                setTimeout(() => this.citySelect.open());
            }
        }
    }

    public getAddress(): Address | Observable<Address> {
        const address: Address = {
            addressLine1: (this.addressLine1Control.value && this.addressLine1Control.value.trim()) || '',
            addressLine2: (this.addressLine2Control.value && this.addressLine2Control.value.trim()) || '',
            city: (this.cityControl.value && this.cityControl.value.trim()) || '',
            state: (this.stateControl.value && this.stateControl.value.trim()) || '',
            postalCode: (this.postalCodeControl.value && this.postalCodeControl.value.trim()) || '',
            country: 'US',
            manualAddress: true
        };

        if (this.trilliumVerification) {
            return this.trilliumService.verifyAddress(address).pipe(
                map(addr => {
                    addr.manualAddress = true;
                    if (!addr.country) {
                        addr.country = 'US';
                    }
                    return addr;
                })
            );
        }
        return address;
    }

    public writeValue(value: any): void {
        this.form.markAsPristine();
        if (value && typeof value === 'object') {
            const address = value as Address;
            this.form.setValue({
                addressLine1: address.addressLine1 || '',
                addressLine2: address.addressLine2 || '',
                city: address.city || '',
                state: address.state || '',
                postalCode: address.postalCode || ''
            });
        } else {
            this.form.setValue({
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: ''
            });
        }
    }

    public registerOnChange(changeHandler: Function): void {
        this.propagateChange = changeHandler;
        if (this.lastPropagated !== undefined) {
            this.propagateChange(this.lastPropagated);
        }
    }

    public registerOnTouched(): void {}

    public validate(): any {
        if (
            this.form.valid ||
            (!this.addressLine1Control.value &&
                !this.addressLine2Control.value &&
                !this.cityControl.value &&
                !this.stateControl.value &&
                !this.postalCodeControl.value)
        ) {
            return null;
        } else {
            return { address: true };
        }
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}

export interface ManualAddressLabelConfig {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
}
