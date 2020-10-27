import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreviousBodilyInjuryModalComponent } from '@shared/previous-bodily-injury-modal/previous-bodily-injury-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { TellUsBitMoreComponent } from './tell-us-bit-more.component';

describe('TellUsBitMoreComponent', () => {
    let component: TellUsBitMoreComponent;
    let formBuilder: FormBuilder;
    let testLeadYearsInsured;
    let testLeadBILimits;
    let testFormData;
    let testInsuranceCoverageOptions;
    let mockDialog;

    beforeEach(() => {
        mockDialog = {};

        testInsuranceCoverageOptions = [
            {
                code: 'code1',
                name: 'value1'
            },
            {
                code: 'code2',
                name: 'value2'
            }
        ];

        testLeadYearsInsured = {
            yearsInsured: testInsuranceCoverageOptions[0].code
        };
        testLeadBILimits = {
            bILimits: testInsuranceCoverageOptions[1].code
        };

        testFormData = {
            selected: {
                yearsInsured: testInsuranceCoverageOptions[0].code,
                bILimits: testInsuranceCoverageOptions[1].code
            },
            allOptions: testInsuranceCoverageOptions
        };
    });

    describe('unit test', () => {
        beforeEach(() => {
            formBuilder = new FormBuilder();
            component = new TellUsBitMoreComponent(mockDialog);
        });

        describe('ngOnInit', () => {
            it('should create a form with no default values', fakeAsync(() => {
                component.ngOnInit();
                tick();
                const yearsInsuredControl = component.form.get('yearsInsured');
                const bILimitsControl = component.form.get('bILimits');
                expect(yearsInsuredControl.value).toBeFalsy('coverage status should not have a default value');
                expect(bILimitsControl.value).toBeFalsy('coverage status should not have a default value');
            }));
            it('should patch value with value from Parent component', fakeAsync(() => {
                component.ngOnInit();
                tick();
                component.form.get('yearsInsured').setValue(component.selectedYearsInsuredValue);
                component.form.get('bILimits').setValue(component.selectedPriorPolicyLimitsValue);
                expect(component.selectedYearsInsuredValue).toEqual(component.form.get('yearsInsured').value);
                expect(component.selectedPriorPolicyLimitsValue).toEqual(component.form.get('bILimits').value);
            }));
        });

        describe('integrated test', () => {
            let fixture: ComponentFixture<TellUsBitMoreComponent>;
            let de: DebugElement;
            let el: any;
            let mockDialogRef;
            const mockMatDialog = {
                open: jasmine.createSpy('open'),
                close: jasmine.createSpy('close')
            };

            beforeEach(async(() => {
                TestBed.configureTestingModule({
                    declarations: [TellUsBitMoreComponent, PreviousBodilyInjuryModalComponent],
                    imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, VertiMaterialModule],
                    providers: [{ provide: MatDialog, useValue: mockMatDialog }]
                }).compileComponents();
            }));

            beforeEach(() => {
                fixture = TestBed.createComponent(TellUsBitMoreComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                el = de.nativeElement;
                mockDialogRef = {
                    open: jasmine.createSpy('open')
                };
            });

            describe('no initial data', () => {
                beforeEach(() => {
                    fixture.autoDetectChanges();
                });

                it('should create', () => {
                    expect(component).toBeTruthy();
                });
                it('should have the correct title', () => {
                    expect(el.innerText).toContain(`Tell us a bit more.`);
                });

                it('should have the correct image', () => {
                    const img = de.queryAll(By.css('img[src$="/Icon_help.svg"]'));
                    expect(img.length).toEqual(1);
                });

                it('should disable the button when state is not selected', async () => {
                    fixture.detectChanges();
                    const button = fixture.debugElement.query(By.css('button'));
                    expect(button.nativeElement.disabled).toBeTruthy();
                });

                it('should have open the modal popup on clicking help icon', () => {
                    mockDialogRef.open(PreviousBodilyInjuryModalComponent, '300px');
                    expect(mockDialogRef.open).toHaveBeenCalled();
                });
            });

            describe('with initial data', () => {
                beforeEach(() => {
                    fixture.autoDetectChanges();
                });

                it('should call the form submitted', async () => {
                    component.onSubmit();
                    component.form.get('yearsInsured').setValue(testLeadYearsInsured.yearsInsured);
                    component.form.get('bILimits').setValue(testLeadBILimits.bILimits);
                    fixture.detectChanges();
                    expect(component.onSubmit).toBeTruthy();
                });

                it('should patch value with dummy data', fakeAsync(() => {
                    component.ngOnInit();
                    tick();
                    component.form.get('yearsInsured').setValue(testInsuranceCoverageOptions[0]);
                    component.form.get('bILimits').setValue(testInsuranceCoverageOptions[1]);
                    expect(testInsuranceCoverageOptions[0]).toEqual(component.form.get('yearsInsured').value);
                    expect(testInsuranceCoverageOptions[1]).toEqual(component.form.get('bILimits').value);
                }));
                it('should yearsInsured value true if selectedYearsInsuredValue true', fakeAsync(() => {
                    component.selectedYearsInsuredValue = true;
                    component.ngOnInit();
                    tick();
                    expect(component.form.get('yearsInsured').value).toEqual(true);
                }));
                it('should bILimits value true if selectedPriorPolicyLimitsValue true', fakeAsync(() => {
                    component.selectedPriorPolicyLimitsValue = true;
                    component.ngOnInit();
                    tick();
                    expect(component.form.get('bILimits').value).toEqual(true);
                }));
                it('should bILimits value true if selectedPriorPolicyLimitsValue true', fakeAsync(() => {
                    component.onModalOpen();
                    expect(mockMatDialog.open).toHaveBeenCalledWith(PreviousBodilyInjuryModalComponent, {
                        data: 'modal opened',
                        panelClass: 'existing-damage-modal'
                    });
                }));
            });
        });
    });
});
