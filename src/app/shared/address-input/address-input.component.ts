import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Address } from '@app/store/models/lead.model';
import { AutofillAddressLabelConfig } from '../autofill-address/autofill-address.component';
import { ManualAddressLabelConfig } from '../manual-address/manual-address.component';

@Component({
    selector: 'verti-address-input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressInputComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AddressInputComponent),
            multi: true
        }
    ],
    templateUrl: './address-input.component.html',
    styleUrls: ['./address-input.component.scss']
})
export class AddressInputComponent implements ControlValueAccessor, OnInit {
    private readonly DEFAULT_LABEL_CONFIG: AddressInputLabelConfig = {
        autofill: {},
        manual: {}
    };
    @Input() labelConfig: AddressInputLabelConfig = {};
    @Input() placeholderConfig: AddressInputLabelConfig = {};

    @Input() addressLine2 = false;
    @Input() readonly = false;
    @Input() trilliumVerification = false;
    @Input() allowPOBox = true;

    public form: FormGroup;
    private autofillAddress: FormControl;
    private manualAddress: FormControl;

    private lastPropagated: Observable<Address>;
    private propagateChange: Function = () => {};

    constructor() {}

    public ngOnInit(): void {
        this.labelConfig = { ...this.DEFAULT_LABEL_CONFIG, ...this.labelConfig };
        this.placeholderConfig = { ...this.DEFAULT_LABEL_CONFIG, ...this.placeholderConfig };

        this.buildForm();

        this.form.valueChanges.subscribe(() => {
            this.lastPropagated = this.getAddress();
            this.propagateChange(this.lastPropagated);
        });
    }

    public writeValue(value: any): void {
        if (value && typeof value === 'object' && value.manualAddress) {
            this.toggleManualAddress(value);
        } else {
            this.currentControl().setValue(value);
        }
    }

    public registerOnChange(fn: Function): void {
        this.propagateChange = fn;
        if (this.lastPropagated !== undefined) {
            this.propagateChange(this.lastPropagated);
        }
    }

    public registerOnTouched(fn: Function): void {}

    public validate(): any {
        return this.currentControl().errors;
    }

    private buildForm(): void {
        this.autofillAddress = new FormControl(null);
        this.manualAddress = new FormControl(null);

        this.form = new FormGroup({
            autofillAddress: this.autofillAddress
        });
    }

    public toggleManualAddress(partialAddress: Address): void {
        this.form.removeControl('autofillAddress');
        this.form.addControl('manualAddress', this.manualAddress);
        this.form.updateValueAndValidity();

        setTimeout(() => {
            this.currentControl().setValue(partialAddress);
        });
    }

    private currentControl(): FormControl {
        return this.form.contains('autofillAddress') ? this.autofillAddress : this.manualAddress;
    }

    private getAddress(): Observable<Address> {
        const val = this.currentControl().value;
        if (val) {
            if (val instanceof Observable) {
                return val;
            }
            return of(val);
        }
        return null;
    }
}

export interface AddressInputLabelConfig {
    autofill?: AutofillAddressLabelConfig;
    manual?: ManualAddressLabelConfig;
}
