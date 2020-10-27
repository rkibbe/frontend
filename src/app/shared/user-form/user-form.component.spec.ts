import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { DebugElement } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { DateFormatter } from '../formatters/date-formatter';
import { dateValidator } from '../validators/date-validator';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatButtonToggleModule } from '@angular/material';
import { NameInputDirective } from '../directives/name-input.directive';
import { InputMaskDirective } from '../directives/input-mask.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('UserFormComponent', () => {
    const INVALID_DATE_ERROR_MESSAGE = 'Please use MM/DD/YYYY for your birthdate.';
    const DATE_OUT_OF_RANGE_ERROR_MESSAGE = 'Please enter your full 4 digit birth year.';

    describe('unit test', () => {
        let component: UserFormComponent;

        beforeEach(() => {
            const dateFormatter = new DateFormatter();
            component = new UserFormComponent(dateFormatter);

            component.formGroup = new FormGroup({});

            component.disableInput = false;
        });

        it('should emit form values when details are saved', () => {
            spyOn(component.formGroupValue, 'emit');
            const formGroupCopy = { ...component.formGroup.value };

            component.saveDetails();

            expect(component.formGroupValue.emit).toHaveBeenCalledTimes(1);
            expect(component.formGroupValue.emit).toHaveBeenCalledWith(formGroupCopy);
        });
    });

    describe('integrated test', () => {
        let component: UserFormComponent;
        let fixture: ComponentFixture<UserFormComponent>;
        let de: DebugElement;

        let controlNames;

        let firstNameControl: FormControl;
        let lastNameControl: FormControl;
        let dobControl: FormControl;
        let ageControl: FormControl;
        let genderCodeControl: FormControl;
        let el: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [UserFormComponent, NameInputDirective, InputMaskDirective],
                imports: [
                    BrowserAnimationsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    FlexLayoutModule,
                    MatInputModule,
                    MatFormFieldModule,
                    MatButtonModule,
                    MatButtonToggleModule
                ],
                providers: [DateFormatter]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserFormComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            const dateFormatter = TestBed.get(DateFormatter);
            controlNames = {
                firstName: 'firstName',
                lastName: 'lastName',
                dob: 'DOB',
                age: 'age',
                genderCode: 'genderCode'
            };

            firstNameControl = new FormControl('', Validators.required);
            lastNameControl = new FormControl('', Validators.required);
            dobControl = new FormControl('', Validators.compose([Validators.required, dateValidator(dateFormatter)]));
            ageControl = new FormControl('', Validators.required);
            genderCodeControl = new FormControl('', Validators.required);

            const formControlObj = {};
            formControlObj[controlNames.firstName] = firstNameControl;
            formControlObj[controlNames.lastName] = lastNameControl;
            formControlObj[controlNames.dob] = dobControl;
            formControlObj[controlNames.age] = ageControl;
            formControlObj[controlNames.genderCode] = genderCodeControl;

            component.formGroup = new FormGroup(formControlObj);
            component.disableInput = false;

            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should have all input fields when full form group is provided', () => {
            const firstNameInput = de.query(By.css(`[formcontrolname=${controlNames.firstName}]`)).nativeElement;
            const lastNameInput = de.query(By.css(`[formcontrolname=${controlNames.lastName}]`)).nativeElement;
            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`)).nativeElement;
            const ageInput = de.query(By.css(`[formcontrolname=${controlNames.age}]`)).nativeElement;
            const genderCodeToggle = de.query(By.css(`[formcontrolname=${controlNames.genderCode}]`)).nativeElement;

            expect(firstNameInput && lastNameInput && dobInput && ageInput && genderCodeToggle).toBeTruthy();
        });

        it('should only have firstName, lastName, and genderCode fields if no form fields are provided', () => {
            component.formGroup = new FormGroup({});

            fixture.detectChanges();

            const firstNameInput = de.query(By.css(`[formcontrolname=${controlNames.firstName}]`));
            const lastNameInput = de.query(By.css(`[formcontrolname=${controlNames.lastName}]`));
            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`));
            const ageInput = de.query(By.css(`[formcontrolname=${controlNames.age}]`));
            const genderCodeToggle = de.query(By.css(`[formcontrolname=${controlNames.genderCode}]`));

            expect(firstNameInput && lastNameInput && genderCodeToggle).toBeTruthy();
            expect(dobInput || ageInput).toBeFalsy();
        });

        it('should have a disabled button when form is invalid', () => {
            const nextButton = de.query(By.css('.verti-next-btn')).nativeElement;

            expect(nextButton).toBeTruthy('next button should exist');
            expect(nextButton.disabled).toBeTruthy('next button should be disabled');
        });

        it('should have an enabled button when form is valid', () => {
            validateForm();

            fixture.detectChanges();

            const nextButton = de.query(By.css('.verti-next-btn')).nativeElement;

            expect(nextButton.disabled).toBeFalsy('next button should not be disabled');
        });

        it('should call saveDetails on valid next button click', () => {
            const nextButton = de.query(By.css('.verti-next-btn')).nativeElement;
            spyOn(component.formGroupValue, 'emit');
            validateForm();
            const formGroupCopy = { ...component.formGroup.value };

            fixture.detectChanges();

            expect(component.formGroupValue.emit).not.toHaveBeenCalled();

            nextButton.click();

            expect(component.formGroupValue.emit).toHaveBeenCalledTimes(1);
            expect(component.formGroupValue.emit).toHaveBeenCalledWith(formGroupCopy);
        });

        it('should show invalid date message when date is invalid', () => {
            expect(el.innerText).not.toContain(INVALID_DATE_ERROR_MESSAGE);

            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`)).nativeElement;
            dobInput.value = '12';
            dobInput.dispatchEvent(new Event('input'));
            dobInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();

            expect(el.innerText).toContain(INVALID_DATE_ERROR_MESSAGE);
        });

        it('should show invalid range message when date is out of range', () => {
            expect(el.innerText).not.toContain(DATE_OUT_OF_RANGE_ERROR_MESSAGE);

            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`)).nativeElement;
            dobInput.value = '12121899';
            dobInput.dispatchEvent(new Event('input'));
            dobInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();

            expect(el.innerText).toContain(DATE_OUT_OF_RANGE_ERROR_MESSAGE);
        });

        it('should not show error message until invalid on blur', () => {
            expect(el.innerText).not.toContain(DATE_OUT_OF_RANGE_ERROR_MESSAGE);

            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`)).nativeElement;
            dobInput.value = '12121980';
            dobInput.dispatchEvent(new Event('input'));
            dobInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();

            expect(el.innerText).not.toContain(DATE_OUT_OF_RANGE_ERROR_MESSAGE);

            dobInput.value = '12121899';
            dobInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(el.innerText).not.toContain(DATE_OUT_OF_RANGE_ERROR_MESSAGE);

            dobInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();

            expect(el.innerText).toContain(DATE_OUT_OF_RANGE_ERROR_MESSAGE);
        });

        it('should have firstName, lastName, and dob as readonly fields when isADPFQuote is true', () => {
            const firstNameInput = de.query(By.css(`[formcontrolname=${controlNames.firstName}]`)).nativeElement;
            const lastNameInput = de.query(By.css(`[formcontrolname=${controlNames.lastName}]`)).nativeElement;
            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`)).nativeElement;
            const ageInput = de.query(By.css(`[formcontrolname=${controlNames.age}]`)).nativeElement;
            const genderCodeToggle = de.query(By.css(`[formcontrolname=${controlNames.genderCode}]`)).nativeElement;

            expect(
                isTrueString(firstNameInput.getAttribute('ng-reflect-readonly')) ||
                    isTrueString(lastNameInput.getAttribute('ng-reflect-readonly')) ||
                    isTrueString(dobInput.getAttribute('ng-reflect-readonly')) ||
                    isTrueString(ageInput.getAttribute('ng-reflect-readonly')) ||
                    isTrueString(genderCodeToggle.getAttribute('ng-reflect-readonly'))
            ).toBeFalsy('no fields should be readonly');

            component.disableInput = true;
            fixture.detectChanges();

            expect(
                isTrueString(firstNameInput.getAttribute('ng-reflect-readonly')) &&
                    isTrueString(lastNameInput.getAttribute('ng-reflect-readonly')) &&
                    isTrueString(dobInput.getAttribute('ng-reflect-readonly'))
            ).toBeTruthy('firstName, lastName, and dob fields should be readonly');

            expect(
                isTrueString(ageInput.getAttribute('ng-reflect-readonly')) ||
                    isTrueString(genderCodeToggle.getAttribute('ng-reflect-readonly'))
            ).toBeFalsy('age and genderCode should not be readonly');
        });

        function validateForm() {
            const firstNameInput = de.query(By.css(`[formcontrolname=${controlNames.firstName}]`)).nativeElement;
            const lastNameInput = de.query(By.css(`[formcontrolname=${controlNames.lastName}]`)).nativeElement;
            const dobInput = de.query(By.css(`[formcontrolname=${controlNames.dob}]`)).nativeElement;
            const ageInput = de.query(By.css(`[formcontrolname=${controlNames.age}]`)).nativeElement;
            const genderCodeToggle = de
                .query(By.css(`[formcontrolname=${controlNames.genderCode}]`))
                .query(By.css('button')).nativeElement;

            firstNameInput.value = 'first';
            firstNameInput.dispatchEvent(new Event('input'));
            lastNameInput.value = 'last';
            lastNameInput.dispatchEvent(new Event('input'));
            dobInput.value = '12121980';
            dobInput.dispatchEvent(new Event('input'));
            ageInput.value = '1';
            ageInput.dispatchEvent(new Event('input'));

            genderCodeToggle.click();
        }

        function isTrueString(str: string): boolean {
            return str === 'true';
        }
    });
});
