import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidatorFn
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { GoogleAddressPrediction, GooglePredictionService } from '@services/google-prediction.service';
import { TrilliumAddressService } from '@services/trillium-address.service';
import { Address } from '@app/store/models/lead.model';
import { addressInterfaceValidator } from '../validators/address-interface.validator';
import { poBoxValidator } from '../validators/po-box-validator';
import { AddressPipe } from '../pipes/address.pipe';
import { TitleHolderContactService } from '@services/title-holder-contact.service';

@Component({
    selector: 'verti-autofill-address',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutofillAddressComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AutofillAddressComponent),
            multi: true
        }
    ],
    templateUrl: './autofill-address.component.html',
    styleUrls: ['./autofill-address.component.scss']
})
export class AutofillAddressComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Output() changeToManualAddress = new EventEmitter();

    private readonly DEFAULT_LABEL_CONFIG: AutofillAddressLabelConfig = {
        main: 'Address',
        addressLine2: 'Apt # (optional)'
    };
    @Input() labelConfig: AutofillAddressLabelConfig = {};
    @Input() placeholderConfig: AutofillAddressLabelConfig = {};

    @Input() addressLine2 = false;
    @Input() readonly = false;
    @Input() trilliumVerification = false;
    @Input() allowPOBox = true;

    public readonly SWITCH_TO_MANUAL_OPTION = 0;
    googleSuggestionSelectedAtleastOnce: boolean;
    public form: FormGroup;
    private addressControl: FormControl;
    private addressLine2Control: FormControl;

    public addressPredictions: GoogleAddressPrediction[] = null;

    private lastPropagated: any;

    private ngDestroy$ = new Subject();

    constructor(
        private googlePredictionService: GooglePredictionService,
        private trilliumService: TrilliumAddressService,
        private addressPipe: AddressPipe,
        private titleHolderContactService: TitleHolderContactService
    ) {
        this.googleSuggestionSelectedAtleastOnce = false;
    }

    private propagateChange: Function = () => { };

    public ngOnInit(): void {
        this.labelConfig = { ...this.DEFAULT_LABEL_CONFIG, ...this.labelConfig };
        this.placeholderConfig = { ...this.DEFAULT_LABEL_CONFIG, ...this.placeholderConfig };

        const addressValidators: ValidatorFn[] = [addressInterfaceValidator];

        if (!this.allowPOBox) {
            addressValidators.push(
                poBoxValidator(() => this.displayGooglePrediction()(this.addressControl && this.addressControl.value))
            );
        }

        this.addressControl = new FormControl(null, addressValidators);
        this.addressLine2Control = this.addressLine2 ? new FormControl(null) : undefined;
        this.form = new FormGroup({
            address: this.addressControl
        });

        if (this.addressLine2) {
            this.form.addControl('addressLine2', this.addressLine2Control);
        }

        this.addressControl.valueChanges
            .pipe(
                debounceTime(500),
                filter(value => typeof value === 'string' && !!value),
                switchMap(input => this.googlePredictionService.getGooglePlacePredictions(input)),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(predictions => (this.addressPredictions = predictions), () => (this.addressPredictions = []));

        this.addressControl.valueChanges
            .pipe(filter(val => val === this.SWITCH_TO_MANUAL_OPTION))
            .subscribe(() => this.changeToManualAddress.emit(this.currFormToAddressInterface()));

        this.addressControl.valueChanges
            .pipe(filter(val => val && typeof val === 'object' && !!(val as GoogleAddressPrediction).placeId))
            .subscribe((prediction: GoogleAddressPrediction) => {
                this.googlePredictionService
                    .getAddressDetails(prediction)
                    .subscribe(address => {
                        this.addressControl.setValue(address);
                        if (!this.googleSuggestionSelectedAtleastOnce) {
                            this.googleSuggestionSelectedAtleastOnce = true;
                        }
                        this.addressControl.setValue(address);
                        if (address && !address.postalCode) {
                            this.changeToManualAddress.emit(this.currFormToAddressInterface());
                        }
                    });
            });


        this.form.valueChanges.subscribe(value => {
            this.lastPropagated = this.form.valid ? this.getAddress(value) : null;
            if (!this.googleSuggestionSelectedAtleastOnce && this.form.valid &&
                !this.titleHolderContactService.ignoreDirtyAfterGoogleSuggestion) {
                this.googleSuggestionSelectedAtleastOnce = true;
            }
            if (this.titleHolderContactService.ignoreDirtyAfterGoogleSuggestion && !this.form.valid) {
                this.googleSuggestionSelectedAtleastOnce = false;
                this.titleHolderContactService.ignoreDirtyAfterGoogleSuggestion = false;
            }
            this.propagateChange(this.lastPropagated);
        });
    }

    private currFormToAddressInterface(): Partial<Address> {
        const formVal = this.form.value;
        const addr: Partial<Address> = {
            addressLine1: typeof formVal.address === 'string' ? formVal.address : formVal.address.addressLine1
        };

        if (formVal.addressLine2) {
            addr.addressLine2 = formVal.addressLine2;
        }

        return addr;
    }

    public getAddress(formVal: any): Observable<Address> {
        const addressObj: Address | GoogleAddressPrediction = formVal.address;
        let addressObs: Observable<Address>;

        if ((addressObj as GoogleAddressPrediction).placeId) {
            addressObs = this.googlePredictionService.getAddressDetails(addressObj as GoogleAddressPrediction);
        } else {
            addressObs = of(addressObj as Address);
        }

        addressObs = addressObs.pipe(
            map(addr => {
                if (formVal.addressLine2) {
                    addr.addressLine2 = formVal.addressLine2.trim();
                }
                if (!addr.country) {
                    addr.country = 'US';
                }
                return addr;
            })
        );

        if (this.trilliumVerification && !this.readonly) {
            addressObs = this.trilliumService.verifyAddress(addressObs);
        }

        return addressObs.pipe(
            map(addr => {
                addr.manualAddress = false;
                return addr;
            })
        );
    }

    public writeValue(value: any): void {
        if (value && typeof value === 'object') {
            const addr: Address = { ...value };
            if (addr.addressLine1 || addr.addressLine2 || addr.city || addr.state || addr.postalCode) {
                if (this.addressLine2) {
                    this.addressLine2Control.setValue(addr.addressLine2 || '');
                    addr.addressLine2 = '';
                }
                this.addressControl.setValue(addr);
            } else {
                if (this.addressLine2) {
                    this.addressLine2Control.setValue('');
                }
                this.addressControl.setValue(null);
            }
        } else {
            if (this.addressLine2) {
                this.addressLine2Control.setValue('');
            }
            this.addressControl.setValue(null);
        }
    }

    public registerOnChange(fn: Function): void {
        this.propagateChange = fn;
        if (this.lastPropagated !== undefined) {
            this.propagateChange(this.lastPropagated);
        }
    }

    public registerOnTouched(fn: Function): void { }

    public validate(): any {
        if (this.form.valid) {
            return null;
        }
        return { address: true };
    }

    public displayGooglePrediction() {
        return (prediction?: string | Address | GoogleAddressPrediction): string | undefined => {
            if (typeof prediction === 'object' && prediction) {
                if ((prediction as GoogleAddressPrediction).formattedAddress) {
                    return (prediction as GoogleAddressPrediction).formattedAddress;
                } else if ((prediction as Address).addressLine1) {
                    return this.addressPipe.transform(prediction as Address);
                }
            } else if (typeof prediction === 'string') {
                return prediction;
            }

            return undefined;
        };
    }

    public ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}

export interface AutofillAddressLabelConfig {
    main?: string;
    addressLine2?: string;
}
