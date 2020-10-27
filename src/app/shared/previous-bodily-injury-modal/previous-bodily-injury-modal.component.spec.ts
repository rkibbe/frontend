import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PreviousBodilyInjuryModalComponent } from './previous-bodily-injury-modal.component';
import {  MatDialogRef, MatDialog } from '@angular/material';
import { VertiMaterialModule } from '../verti-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

describe('PreviousBodilyInjuryModalComponent', () => {
    let component: PreviousBodilyInjuryModalComponent;
    let testFormData;
    let mockDialog;

    beforeEach(() => {
        mockDialog = {};

        testFormData = [
            {
                code: 'code1',
                name: 'value1'
            },
            {
                code: 'code2',
                name: 'value2'
            }
        ];
    });

    describe('unit test', () => {
        beforeEach(() => {
            component = new PreviousBodilyInjuryModalComponent(mockDialog);
            mockDialog.disableClose = true;
        });

        describe('ngOnInit', () => {
            it('should have correct title', fakeAsync(() => {
                component.ngOnInit();
                tick();
                expect(component.title).toEqual('Previous Bodily Injury Coverage');
            }));
        });

        describe('integrated test', () => {
            let fixture: ComponentFixture<PreviousBodilyInjuryModalComponent>;
            let de: DebugElement;
            let el: any;
            let mockDialogRef;
            let mockDialogService;

            beforeEach(async(() => {
                mockDialogService = {};
                TestBed.configureTestingModule({
                    declarations: [PreviousBodilyInjuryModalComponent],
                    imports: [BrowserAnimationsModule, VertiMaterialModule],
                    providers: [
                        { provide: MatDialog, useValue: mockDialogRef },
                        { provide: MatDialogRef, useValue: {} }
                    ]
                }).compileComponents();
            }));

            beforeEach(() => {
                fixture = TestBed.createComponent(PreviousBodilyInjuryModalComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                el = de.nativeElement;
                mockDialogRef = {
                    close: jasmine.createSpy('close')
                };
            });

            describe('initial data', () => {
                beforeEach(() => {
                    fixture.autoDetectChanges();
                });

                it('should create', () => {
                    expect(component).toBeTruthy();
                });

                it('should have close modal popup on close icon click', () => {
                    mockDialogRef.close();
                    expect(mockDialogRef.close).toHaveBeenCalled();
                });
            });
        });
    });
});
