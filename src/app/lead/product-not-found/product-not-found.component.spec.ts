import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Store, StoreModule } from '@ngrx/store';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { ErrorModalComponent } from '@shared/error-modal/error-modal.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { ProductNotFoundComponent } from './product-not-found.component';
import { TranslateModule } from '@ngx-translate/core';



describe('ProductNotFoundComponent', () => {
    let component: ProductNotFoundComponent;
    let fixture: ComponentFixture<ProductNotFoundComponent>;
    const mockData = {
        leadLandingScreen: 'drivinghistory',
        marketingData: { campaignID: '534353534' },
        enterprisePartyID: '5534353443',
        quote: { quoteNumber: '424234333' },
        firstName: 'test name',
        monthlyPremiumPrice: '4343',
        primaryEmailAddress: 'test@email.com'
    };
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };
    const mockWindow = {
        dataLayer: []
    };
    const mockMatDialog = {
        open: jasmine.createSpy('open')
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProductNotFoundComponent, PageImageTitleComponent],
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
                {
                    provide: NavigationService,
                    useValue: {
                        upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
                    }
                },
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: Store, useValue: mockedStore }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should show error msg for invalid mail on onEmailBlur', () => {
        component.noProductsFoundForm.get('primaryEmailAddress').setValue('test');

        component.onEmailBlur();
        expect(component.invalidEmail).toBe(true);
    });
    it('should not show error msg for valid mail on onEmailBlur ', () => {
        component.noProductsFoundForm.get('primaryEmailAddress').setValue('');

        component.onEmailBlur();
        expect(component.invalidEmail).toBe(false);
    });
    it('should have correct mail after vaildate  ', () => {
        component.noProductsFoundForm.get('primaryEmailAddress').setValue('test@gmail.com');
        component.validateEmail('primaryEmailAddress');
        expect(component.noProductsFoundForm.get('primaryEmailAddress').value).toEqual('test@gmail.com');
    });
    it('should open ErrorModalComponent on click of getUpdates  ', () => {
        component.noProductsFoundForm.get('primaryEmailAddress').setValue('test');
        component.getUpdates();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(new LeadActions.SavePNIData({ primaryEmailAddress: 'test' }));
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(ErrorModalComponent, {
            data: {
                imgSource: './assets/img/Icon_nocovermap.svg',
                title: `Thanks! We’ll keep you updated.`,
                body: `Look for an update once Verti has launched in your neighborhood.`
            },
            panelClass: 'custom-error-modal'
        });
    });
});
