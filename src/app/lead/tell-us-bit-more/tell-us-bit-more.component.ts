import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TypeListOption } from '@services/type-list.service';
import { PreviousBodilyInjuryModalComponent } from '@shared/previous-bodily-injury-modal/previous-bodily-injury-modal.component';

@Component({
    selector: 'verti-tell-us-bit-more',
    templateUrl: './tell-us-bit-more.component.html',
    styleUrls: ['./tell-us-bit-more.component.scss']
})
export class TellUsBitMoreComponent implements OnInit, OnDestroy {
    title: string;
    public form: FormGroup;
    public licenseInfoGroup: FormGroup;
    public stateOptions: TypeListOption[] = [];
    public statusOptions: TypeListOption[] = [];
    @Input() yearsInsuredOptions;
    @Input() priorPolicyLimitsOptions;
    @Input() selectedYearsInsuredValue;
    @Input() selectedPriorPolicyLimitsValue;
    @Output() formGroupValue = new EventEmitter();
    imgSource2: string;
    constructor(private dialog: MatDialog) {
        this.title = `Tell us a bit more.`;
        this.imgSource2 = './assets/img/Icon_help.svg';
    }

    ngOnInit() {
        this.form = new FormGroup({
            yearsInsured: new FormControl(null, Validators.required),
            bILimits: new FormControl(null, Validators.required)
        });
        if (this.selectedYearsInsuredValue) {
            this.form.get('yearsInsured').setValue(this.selectedYearsInsuredValue);
            this.form.updateValueAndValidity();
        }
        if (this.selectedPriorPolicyLimitsValue) {
            this.form.get('bILimits').patchValue(this.selectedPriorPolicyLimitsValue);
            this.form.updateValueAndValidity();
        }
    }

    onSubmit() {
        this.formGroupValue.emit({ selected: this.form.value });
    }

    onModalOpen() {
        this.dialog.open(PreviousBodilyInjuryModalComponent, {
            data: 'modal opened',
            panelClass: 'existing-damage-modal'
        });
    }

    ngOnDestroy() {}
}
