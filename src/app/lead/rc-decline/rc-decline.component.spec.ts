import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DiscountSavingModalComponent } from '@shared/discount-saving-modal/discount-saving-modal.component';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { WalmericDialogModalComponent } from 'src/app/core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { RcDeclineComponent } from './rc-decline.component';
import { TranslateModule } from '@ngx-translate/core';




describe('KoDeclineComponent', () => {
    let component: RcDeclineComponent;
    let fixture: ComponentFixture<RcDeclineComponent>;

    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };

    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RcDeclineComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                SharedModule,
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [{ provide: MatDialog, useValue: mockMatDialog }, provideMockStore({ initialState })]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RcDeclineComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                firstName: 'test Name',
                quickQuote: {},
                quote: {}
            }
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('first name should empty if no values found in store ', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                firstName: '',
                quickQuote: {},
                quote: {}
            }
        });
        component.ngOnInit();
        expect(component.firstName).toEqual('');
    });
    it('should have correct subtitle', () => {
        component.ngOnInit();
        expect(component.subtitle).toEqual('test Name HAS BEEN DECLINED');
    });
    it('should open WalmericDialogModalComponent on click of openWalmericModal', () => {
        component.openWalmericModal();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    });
    it('should open DiscountSavingModalComponent on click of openDialog', () => {
        component.openDialog();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(DiscountSavingModalComponent, {
            panelClass: 'verti-discount-saving-modal'
        });
    });
});
