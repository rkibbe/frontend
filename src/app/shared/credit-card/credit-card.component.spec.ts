import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardComponent } from './credit-card.component';
import { VertiMaterialModule } from '../verti-material.module';

describe('CreditCardComponent', () => {
    let component: CreditCardComponent;
    let fixture: ComponentFixture<CreditCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreditCardComponent],
            imports: [VertiMaterialModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreditCardComponent);
        component = fixture.componentInstance;
        component.cardType = 'VISA';
        component.cardHolder = 'Verti';
        component.cardNumber = '1234567890';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have card number ', () => {
        expect(component.cardNumber).toEqual('**** **** **** 7890');
    });
    it('should have card holder name lower case', () => {
        expect(component.cardType).toEqual('visa');
    });
});
