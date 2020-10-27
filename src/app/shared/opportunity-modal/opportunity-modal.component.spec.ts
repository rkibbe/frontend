import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityModalComponent } from './opportunity-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { VertiMaterialModule } from '../verti-material.module';
import { CoreModule } from '@angular/flex-layout';

describe('OpportunityModalComponent', () => {
    let component: OpportunityModalComponent;
    let fixture: ComponentFixture<OpportunityModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OpportunityModalComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                CoreModule,
                VertiMaterialModule,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OpportunityModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
