import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallPaymentComponent } from './small-payment.component';
import { PageImageTitleComponent } from '@app/shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromStore from '../../store/reducers/lead.reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DateSuffix } from '@shared/pipes/datesuffix.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
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
describe('SmallPaymentComponent', () => {
    let component: SmallPaymentComponent;
    let fixture: ComponentFixture<SmallPaymentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SmallPaymentComponent, PageImageTitleComponent],
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
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SmallPaymentComponent);
        component = fixture.componentInstance;
        component.smallPlanPayment = allPlans.desktop[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit smallPayment when goToMedium is clicked', () => {
        spyOn(component.smallPayment, 'emit');
        const selectedPlan = 'pp:01';
        component.goToMedium();
        expect(component.smallPayment.emit).toHaveBeenCalledTimes(1);
        expect(component.smallPayment.emit).toHaveBeenCalledWith(selectedPlan);
    });
});
