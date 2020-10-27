import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigPriceComponent } from './big-price.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { VertiMaterialModule } from '../verti-material.module';
import { CoreModule } from '@angular/flex-layout';

describe('BigPriceComponent', () => {
    let component: BigPriceComponent;
    let fixture: ComponentFixture<BigPriceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BigPriceComponent],
            imports: [BrowserAnimationsModule, BrowserModule, CoreModule, VertiMaterialModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BigPriceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct change value on splitPriceComponents', () => {
        component['splitPriceComponents']('777.2323');
        expect(component.change).toEqual('2323');
    });
    it('should have change value "00" on splitPriceComponents', () => {
        component['splitPriceComponents']('555');
        expect(component.change).toEqual('00');
    });
    it('should have change value "10" on splitPriceComponents', () => {
        component['splitPriceComponents']('777.1');
        expect(component.change).toEqual('10');
    });
    it('should have change and doller value empty for split value empty  on splitPriceComponents', () => {
        component['splitPriceComponents'](undefined);
        expect(component.change).toEqual('');
        expect(component.dollar).toEqual('');
    });
});
