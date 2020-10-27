import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoDeclineComponent } from './ko-decline.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { reducers } from 'src/app/store/reducers';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('KoDeclineComponent', () => {
    let component: KoDeclineComponent;
    let fixture: ComponentFixture<KoDeclineComponent>;
    let mockedDialog, mockedStore;
    const mockedLeadData = {
        finalizeQuote: false,
        firstName: 'Michael',
        gender: 'M',
        genderCode: 'M',
        genderValue: 'Male',
        generateQuickQuotePrice: false,
        lastName: 'Zxcz',
        leadID: '00Q29000007W2x3EAC',
        maritalStatus: 'M'
    };
    const mockedLeadDataNoName = {
        finalizeQuote: false,
        firstName: '',
        gender: 'M',
        genderCode: 'M',
        genderValue: 'Male',
        generateQuickQuotePrice: false,
        lastName: 'Zxcz',
        leadID: '00Q29000007W2x3EAC',
        maritalStatus: 'M'
    };
    beforeEach(async(() => {
        mockedDialog = {
            open: jasmine.createSpy('open')
        };
        mockedStore = {};
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(reducers),
                RouterTestingModule,
                VertiMaterialModule,
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot()
            ],
            declarations: [KoDeclineComponent, PageImageTitleComponent],
            providers: [{ provide: MatDialog, useValue: mockedDialog }],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KoDeclineComponent);
        component = fixture.componentInstance;
        mockedStore = TestBed.get(Store);
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedLeadData));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have firstname', () => {
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.firstName).toEqual('Michael');
    });
    it('should not have firstname', () => {
        component.ngOnInit();
        mockedStore.select = jasmine.createSpy('select').and.returnValue(of(mockedLeadDataNoName));
        mockedStore.dispatch = jasmine.createSpy('dispatch');
        fixture.detectChanges();
        fixture = TestBed.createComponent(KoDeclineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.firstName).toEqual('');
    });
    it('should call openWalmericModal', () => {
        spyOn(component, 'openWalmericModal').and.callThrough();
        component.openWalmericModal();
        fixture.detectChanges();
        expect(mockedDialog.open).toHaveBeenCalled();
        expect(component.openWalmericModal).toHaveBeenCalledWith();
        expect(component.openWalmericModal).toBeTruthy();
    });
    it('should call ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.leadSub.closed).toEqual(true);
    });
});
