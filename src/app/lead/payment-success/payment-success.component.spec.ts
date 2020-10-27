import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from '@services/navigation.service';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { PaymentSuccessComponent } from './payment-success.component';
import { TranslateModule } from '@ngx-translate/core';


describe('PaymentSuccessComponent', () => {
    let component: PaymentSuccessComponent;
    let fixture: ComponentFixture<PaymentSuccessComponent>;
    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };
    const navigationServiceStub = {
        upDateMarketingData: () => ({}),
        navigate: jasmine.createSpy('navigate'),
        gotoUrl: jasmine.createSpy('gotoUrl')
    };
    const mockMatDialog = {
        open: jasmine.createSpy('open')
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaymentSuccessComponent, PageImageTitleComponent, TimeoutModalComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: Store, useValue: mockStore },
                provideMockStore({ initialState }),

                { provide: NavigationService, useValue: navigationServiceStub }
            ],

            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentSuccessComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {},
                quote: {},
                enterprisePartyID: '0012900000ZA8GUAA1',
                vertimode: 'sidekick'
            },
            loader: { isLoading: false }
        });
        component.imgSource = './assets/img/Welcome_Icon.svg';
        component.title = 'Welcome to Verti!';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call goToSidekick and without lead data', () => {
        spyOn(component, 'goToSidekick').and.callThrough();
        component.goToSidekick();
        fixture.detectChanges();
        expect(component.lead.enterprisePartyID).toEqual(undefined);
        expect(component.lead.vertimode).toEqual(undefined);
    });
    it('should call goToSidekick and vertimode is undefined', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {},
                quote: {},
                enterprisePartyID: '0012900000ZA8GUAA1',
                vertimode: undefined
            }
        });
        fixture = TestBed.createComponent(PaymentSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component, 'goToSidekick').and.callThrough();
        component.goToSidekick();
        expect(component.lead.enterprisePartyID).toEqual('0012900000ZA8GUAA1');
        expect(component.lead.vertimode).toEqual(undefined);
    });
    it('should call goToSidekick and with lead data', () => {
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {},
                quote: {},
                enterprisePartyID: '0012900000ZA8GUAA1',
                vertimode: 'sidekick'
            }
        });
        fixture = TestBed.createComponent(PaymentSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component, 'goToSidekick').and.callThrough();
        component.goToSidekick();
        expect(component.lead.enterprisePartyID).toEqual('0012900000ZA8GUAA1');
        expect(component.lead.vertimode).toEqual('sidekick');
    });
});
