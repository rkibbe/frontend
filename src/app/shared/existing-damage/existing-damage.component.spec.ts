import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingDamageComponent } from './existing-damage.component';
import { MatIconModule, MatDialogModule, MatDialogRef } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

describe('ExistingDamageComponent', () => {
    let component: ExistingDamageComponent;
    let fixture: ComponentFixture<ExistingDamageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExistingDamageComponent],
            imports: [MatDialogModule, MatIconModule,TranslateModule.forRoot()],
            providers: [{ provide: MatDialogRef, useValue: {} }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExistingDamageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
