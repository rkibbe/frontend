import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MediumPaymentComponent } from './medium-payment.component';
import { PageImageTitleComponent } from '@app/shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
            displaySize: 'medium'
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
            displaySize: 'small'
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
describe('MediumPaymentComponent', () => {
    let component: MediumPaymentComponent;
    let fixture: ComponentFixture<MediumPaymentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediumPaymentComponent, PageImageTitleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [BreakpointObserver]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediumPaymentComponent);
        component = fixture.componentInstance;
        component.mediumPlanPayment = allPlans.desktop[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('when planId is equals pp:01 then  ratevalue is today ', () => {
        component.ngOnInit();
        expect(component.rateValue).toEqual('today');
    });
    it('when planId is not equals pp:01 then ratevalue is mo', () => {
        component.mediumPlanPayment = allPlans.desktop[1];
        component.ngOnInit();
        expect(component.rateValue).toEqual('mo');
    });
    it('when planId is not equals pp:01 then ratevalue is mo', () => {
        component.mediumPlanPayment = allPlans.desktop[2];
        component.ngOnInit();
        expect(component.mediumPlanPayment.displaySize).toEqual('large');
        expect(component.paymentSchedule).toEqual(true);
    });
    it('when showPaymentSchedule is clicked paymentSchedule flag becomes is true', () => {
        component.showPaymentSchedule();
        expect(component.paymentSchedule).toEqual(true);
    });
    it('should emit selectedPlan when doContinue is clicked', () => {
        spyOn(component.selectedPlan, 'emit');
        const selectedPlan = 'pp:01';
        component.doContinue(selectedPlan);
        expect(component.selectedPlan.emit).toHaveBeenCalledTimes(1);
        expect(component.selectedPlan.emit).toHaveBeenCalledWith(selectedPlan);
    });
});
