import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPaymentComponent } from './monthly-payment.component';
import { PageImageTitleComponent } from '@app/shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromStore from '../../store/reducers/lead.reducers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewPorts } from '@app/store/models/lead.model';
import { TranslateModule } from '@ngx-translate/core';

const allPlans: ViewPorts = {
    mobile: [
        {
            planId: 'pp:01',
            planName: 'Pay-in-Full',
            textDescription: 'PAY UP FRONT TO SAVE $284',
            totalAmt: '$1057',
            dueToday: '$1057',
            paymentSchedule: [
                {
                    Today: '$1057.00 Due'
                }
            ],
            displayOrder: '1',
            theme: 'primary',
            displaySize: 'small'
        },
        {
            planId: 'pp:02',
            planName: 'Monthly: 5-Payments',
            textDescription: '$211.4 DUE TODAY, THEN MONTYHLY STARTING ON 11/10',
            totalAmt: '$1057',
            dueToday: '$211.4',
            paymentSchedule: [
                {
                    Today: '$211.40 Due'
                },
                {
                    'November 10': '$211.40 Due'
                },
                {
                    'December 10': '$211.40 Due'
                },
                {
                    'January 11': '$211.40 Due'
                },
                {
                    'February 10': '$211.40 Due'
                }
            ],
            displayOrder: '2',
            theme: 'secondary',
            displaySize: 'large'
        },
        {
            planId: 'pp:06',
            planName: 'Monthly: 6-payments',
            textDescription: '$176.2 DUE TODAY, THEN MONTYHLY STARTING ON 09/10',
            totalAmt: '$1057',
            dueToday: '$176.2',
            paymentSchedule: [
                {
                    Today: '$176.20 Due'
                },
                {
                    'September 10': '$0.00 Due'
                },
                {
                    'October 12': '$176.16 Due'
                },
                {
                    'November 10': '$176.16 Due'
                },
                {
                    'December 10': '$176.16 Due'
                },
                {
                    'January 11': '$176.16 Due'
                },
                {
                    'February 10': '$176.16 Due'
                }
            ],
            displayOrder: '3',
            theme: 'tertiary',
            displaySize: 'large'
        }
    ],
    desktop: [
        {
            planId: 'pp:01',
            planName: 'Pay-in-Full',
            textDescription: 'PAY UP FRONT TO SAVE $284',
            totalAmt: '$1057',
            dueToday: '$1057',
            paymentSchedule: [
                {
                    Today: '$1057.00 Due'
                }
            ],
            displayOrder: '1',
            theme: 'primary',
            displaySize: 'small'
        },
        {
            planId: 'pp:02',
            planName: 'Monthly: 5-Payments',
            textDescription: '$211.4 DUE TODAY, THEN MONTYHLY STARTING ON 11/10',
            totalAmt: '$1057',
            dueToday: '$211.4',
            paymentSchedule: [
                {
                    Today: '$211.40 Due'
                },
                {
                    'November 10': '$211.40 Due'
                },
                {
                    'December 10': '$211.40 Due'
                },
                {
                    'January 11': '$211.40 Due'
                },
                {
                    'February 10': '$211.40 Due'
                }
            ],
            displayOrder: '2',
            theme: 'secondary',
            displaySize: 'large'
        },
        {
            planId: 'pp:06',
            planName: 'Monthly: 6-payments',
            textDescription: '$176.2 DUE TODAY, THEN MONTYHLY STARTING ON 09/10',
            totalAmt: '$1057',
            dueToday: '$176.2',
            paymentSchedule: [
                {
                    Today: '$176.20 Due'
                },
                {
                    'September 10': '$0.00 Due'
                },
                {
                    'October 12': '$176.16 Due'
                },
                {
                    'November 10': '$176.16 Due'
                },
                {
                    'December 10': '$176.16 Due'
                },
                {
                    'January 11': '$176.16 Due'
                },
                {
                    'February 10': '$176.16 Due'
                }
            ],
            displayOrder: '3',
            theme: 'tertiary',
            displaySize: 'large'
        }
    ],
    tablet: [
        {
            planId: 'pp:01',
            planName: 'Pay-in-Full',
            textDescription: 'PAY UP FRONT TO SAVE $284',
            totalAmt: '$1057',
            dueToday: '$1057',
            paymentSchedule: [
                {
                    Today: '$1057.00 Due'
                }
            ],
            displayOrder: '1',
            theme: 'primary',
            displaySize: 'small'
        },
        {
            planId: 'pp:02',
            planName: 'Monthly: 5-Payments',
            textDescription: '$211.4 DUE TODAY, THEN MONTYHLY STARTING ON 11/10',
            totalAmt: '$1057',
            dueToday: '$211.4',
            paymentSchedule: [
                {
                    Today: '$211.40 Due'
                },
                {
                    'November 10': '$211.40 Due'
                },
                {
                    'December 10': '$211.40 Due'
                },
                {
                    'January 11': '$211.40 Due'
                },
                {
                    'February 10': '$211.40 Due'
                }
            ],
            displayOrder: '2',
            theme: 'secondary',
            displaySize: 'large'
        },
        {
            planId: 'pp:06',
            planName: 'Monthly: 6-payments',
            textDescription: '$176.2 DUE TODAY, THEN MONTYHLY STARTING ON 09/10',
            totalAmt: '$1057',
            dueToday: '$176.2',
            paymentSchedule: [
                {
                    Today: '$176.20 Due'
                },
                {
                    'September 10': '$0.00 Due'
                },
                {
                    'October 12': '$176.16 Due'
                },
                {
                    'November 10': '$176.16 Due'
                },
                {
                    'December 10': '$176.16 Due'
                },
                {
                    'January 11': '$176.16 Due'
                },
                {
                    'February 10': '$176.16 Due'
                }
            ],
            displayOrder: '3',
            theme: 'tertiary',
            displaySize: 'large'
        }
    ]
};

describe('MonthlyPaymentComponent', () => {
    let component: MonthlyPaymentComponent;
    let fixture: ComponentFixture<MonthlyPaymentComponent>;

    let mockStore: MockStore<any>;
    const initialState = { lead: fromStore.initialState };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MonthlyPaymentComponent, PageImageTitleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
            providers: [BreakpointObserver, provideMockStore({ initialState })]
        }).compileComponents();

        fixture = TestBed.createComponent(MonthlyPaymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockStore = TestBed.get(Store) as MockStore<any>;
        mockStore.dispatch = jasmine.createSpy('dispatch');
        mockStore.setState({
            lead: {
                ...initialState,
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: [],
                    drivers: [],
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {
                    quoteNumber: '424234333',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    savings: '255.45',
                    paymentPlans: allPlans,
                    nextPaymentDueDate: {
                        day: 22,
                        month: 10,
                        year: 2008
                    }
                }
            }
        });
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be check breakpoints with media query of min-width: 768px', () => {
        const mediaQuery = {
            breakpoints: ['(min-width: 768px)']
        };
        component.findViewport(mediaQuery);
        expect(mediaQuery.breakpoints[0]).toEqual('(min-width: 768px)');
    });
    it('should check media query of min-width: 992px', () => {
        const mediaQuery = {
            breakpoints: ['(min-width: 992px)']
        };
        component.findViewport(mediaQuery);
        expect(mediaQuery.breakpoints[0]).toEqual('(min-width: 992px)');
    });
    it('should be change from small to medium on toggleOption clicks ', () => {
        const selectedPlan = 'pp:01';
        component.toggleOption(selectedPlan);
        const sizeVal = (component.renderSmallPlans.filter(p => p.planId === selectedPlan)[0].displaySize = 'medium');
        expect(sizeVal).toEqual('medium');
    });
    it('should be call scrollTo ', () => {
        const className = 'goToDiscountSavings';
        component.scrollTo(className);
        const elementList = document.querySelectorAll('.' + className);
        const element = elementList[0] as HTMLElement;
        spyOn(element, 'scrollIntoView');
        element.scrollIntoView({ behavior: 'smooth' });
        expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
    it('should emit selectedPlan when doContinue is clicked', () => {
        spyOn(component.selectedPlan, 'emit');
        const selectedPlan = 'pp:01';
        component.doContinue(selectedPlan);
        expect(component.selectedPlan.emit).toHaveBeenCalledTimes(1);
        expect(component.selectedPlan.emit).toHaveBeenCalledWith(selectedPlan);
    });
});
