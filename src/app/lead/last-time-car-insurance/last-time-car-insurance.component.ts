import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TypeListOption } from '@services/type-list.service';

@Component({
    selector: 'verti-last-time-car-insurance',
    templateUrl: './last-time-car-insurance.component.html',
    styleUrls: ['./last-time-car-insurance.component.scss']
})
export class LastTimeCarInsuranceComponent implements OnInit {
    carInsuranceForm: FormGroup;
    carInsuranceFormOptions: TypeListOption[];
    carInsuranceForm$: Subscription;
    title: string;
    @Input() lapsePeriodExtOptions;
    @Input() yearsInsuredOptions;
    @Input() priorPolicyLimitsOptions;
    @Input() selectedLapsePeriodExtValue;
    @Input() selectedYearsInsuredValue;
    @Input() selectedPriorPolicyLimitsValue;
    @Output() formGroupValue = new EventEmitter();
    show: boolean;
    constructor(private fb: FormBuilder) {
        this.carInsuranceFormOptions = [];
        this.title = `When was the last time you had car insurance?`;
        this.show = false;
    }

    ngOnInit() {
        this.carInsuranceForm = this.fb.group({
            carInsurance: ['', Validators.required]
        });

        this.carInsuranceFormOptions = this.lapsePeriodExtOptions;

        if (this.selectedLapsePeriodExtValue) {
            this.carInsuranceForm.get('carInsurance').setValue(this.selectedLapsePeriodExtValue);
            this.carInsuranceForm.updateValueAndValidity();
            this.onButtonToggleClick();
        }
    }

    onButtonToggleClick() {
        const val = this.carInsuranceForm.get('carInsurance').value;
        if (val.code !== this.lapsePeriodExtOptions[0].code) {
            this.show = true;
        } else {
            this.show = false;
        }
    }
    onSubmit() {
        const tempObj = {
            lastActiveInsurance: ''
        };
        const carInsur = this.carInsuranceForm.get('carInsurance').value;
        tempObj.lastActiveInsurance = carInsur.code;
        this.formGroupValue.emit({ selected: tempObj });
    }

    optionSelected(formData) {
        const formObj = {
            lastActiveInsurance: '',
            yearsInsured: '',
            bILimits: '',
            bILimitsValue: ''
        };
        const carInsur = this.carInsuranceForm.get('carInsurance').value;
        formObj.lastActiveInsurance = carInsur.code;
        formObj.yearsInsured = formData.selected.yearsInsured.code;
        formObj.bILimits = formData.selected.bILimits.code;
        formObj.bILimitsValue = formData.selected.bILimits.description;

        this.formGroupValue.emit({ selected: formObj });
    }
}
