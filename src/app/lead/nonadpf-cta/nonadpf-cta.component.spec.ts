import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import * as fromStore from '../../store/reducers/lead.reducers';
import { NonadpfCtaComponent } from './nonadpf-cta.component';
import { TranslateModule } from '@ngx-translate/core';



describe('NonadpfCtaComponent', () => {
    let component: NonadpfCtaComponent;
    let fixture: ComponentFixture<NonadpfCtaComponent>;
    const initialState = {
        lead: fromStore.initialState
    };
    const mockData = {
        leadLandingScreen: 'drivinghistory',
        marketingData: { campaignID: '534353534' },
        enterprisePartyID: '5534353443',
        quote: { quoteNumber: '424234333' },
        firstName: 'test name'
    };
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };
    const mockWindow = {
        dataLayer: []
    };
    let dataLayerServiceStub;

    beforeEach(async(() => {
        dataLayerServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [NonadpfCtaComponent, PageImageTitleComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot({}),
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: window, useValue: mockWindow },
                { provide: DataLayerService, useValue: dataLayerServiceStub },
                { provide: Store, useValue: mockedStore },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NonadpfCtaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should return correct firstname for get firstName method', () => {
        const result = component.firstName;
        expect(result).toEqual('test name');
    });
});
