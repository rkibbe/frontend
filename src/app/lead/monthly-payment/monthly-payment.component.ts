import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PaymentPlan, ViewPorts, Lead } from '@app/store/models/lead.model';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';

@Component({
    selector: 'verti-monthly-payment',
    templateUrl: './monthly-payment.component.html',
    styleUrls: ['./monthly-payment.component.scss']
})
export class MonthlyPaymentComponent implements OnInit, OnDestroy {
    @Output() selectedPlan = new EventEmitter();
    paymentPlans: ViewPorts;
    renderMediumPlans: PaymentPlan[];
    renderSmallPlans: PaymentPlan[];
    private ngDestroy$ = new Subject();
    savingPrice: string;
    leadSub: Subscription;
    additionalFlag: boolean;
    allPlans: ViewPorts = {
        mobile: [
            {
                planId: 'pp:01',
                planName: 'Pay-in-Full',
                textDescription: 'PAY UP FRONT TO SAVE $136.00',
                totalAmt: '$1719.00',
                dueToday: '$1719.00',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$1719.00 Due'
                    }
                ],
                displayOrder: '1',
                theme: 'primary',
                displaySize: 'large'
            },
            {
                planId: 'pp:02',
                planName: 'Monthly: 5-Payments',
                textDescription: '$343.8 DUE TODAY, THEN MONTYHLY STARTING ON 09/24',
                totalAmt: '$1719.00',
                dueToday: '$343.80',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'September 24',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'October 26',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'November 24',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'December 24',
                        value: '$343.80 Due'
                    }
                ],
                displayOrder: '3',
                theme: 'tertiary1',
                displaySize: 'small'
            },
            {
                planId: 'pp:06',
                planName: 'Monthly: 6-payments',
                textDescription: '$286.56 DUE TODAY, THEN MONTYHLY STARTING ON 09/09',
                totalAmt: '$1719.00',
                dueToday: '$286.56',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$286.56 Due'
                    },
                    {
                        key: 'September 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'October 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'November 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'December 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'January 11',
                        value: '$286.48 Due'
                    }
                ],
                displayOrder: '2',
                theme: 'tertiary3',
                displaySize: 'medium'
            }
        ],
        desktop: [
            {
                planId: 'pp:01',
                planName: 'Pay-in-Full',
                textDescription: 'PAY UP FRONT TO SAVE $136.00',
                totalAmt: '$1719.00',
                dueToday: '$1719.00',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$1719.00 Due'
                    }
                ],
                displayOrder: '2',
                theme: 'primary',
                displaySize: 'large'
            },
            {
                planId: 'pp:02',
                planName: 'Monthly: 5-Payments',
                textDescription: '$343.8 DUE TODAY, THEN MONTYHLY STARTING ON 09/24',
                totalAmt: '$1719.00',
                dueToday: '$343.80',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'September 24',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'October 26',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'November 24',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'December 24',
                        value: '$343.80 Due'
                    }
                ],
                displayOrder: '3',
                theme: 'tertiary1',
                displaySize: 'medium'
            },
            {
                planId: 'pp:06',
                planName: 'Monthly: 6-payments',
                textDescription: '$286.56 DUE TODAY, THEN MONTYHLY STARTING ON 09/09',
                totalAmt: '$1719.00',
                dueToday: '$286.56',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$286.56 Due'
                    },
                    {
                        key: 'September 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'October 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'November 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'December 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'January 11',
                        value: '$286.48 Due'
                    }
                ],
                displayOrder: '1',
                theme: 'secondary',
                displaySize: 'small'
            }
        ],
        tablet: [
            {
                planId: 'pp:01',
                planName: 'Pay-in-Full',
                textDescription: 'PAY UP FRONT TO SAVE $136.00',
                totalAmt: '$1719.00',
                dueToday: '$1719.00',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$1719.00 Due'
                    }
                ],
                displayOrder: '1',
                theme: 'primary',
                displaySize: 'large'
            },
            {
                planId: 'pp:02',
                planName: 'Monthly: 5-Payments',
                textDescription: '$343.8 DUE TODAY, THEN MONTYHLY STARTING ON 09/24',
                totalAmt: '$1719.00',
                dueToday: '$343.80',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'September 24',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'October 26',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'November 24',
                        value: '$343.80 Due'
                    },
                    {
                        key: 'December 24',
                        value: '$343.80 Due'
                    }
                ],
                displayOrder: '3',
                theme: 'tertiary1',
                displaySize: 'medium'
            },
            {
                planId: 'pp:06',
                planName: 'Monthly: 6-payments',
                textDescription: '$286.56 DUE TODAY, THEN MONTYHLY STARTING ON 09/09',
                totalAmt: '$1719.00',
                dueToday: '$286.56',
                paymentSchedule: [
                    {
                        key: 'Today',
                        value: '$286.56 Due'
                    },
                    {
                        key: 'September 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'October 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'November 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'December 09',
                        value: '$286.49 Due'
                    },
                    {
                        key: 'January 11',
                        value: '$286.48 Due'
                    }
                ],
                displayOrder: '2',
                theme: 'secondary',
                displaySize: 'small'
            }
        ]
    };


    constructor(private bQ: BreakpointObserver, private store: Store<any>) {
        this.additionalFlag = false;
        this.bQ
            .observe(['(min-width: 768px)', '(min-width: 992px)'])
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(result => {
                this.findViewport(result);
            });
        this.store
            .select(fromStore.quoteSelector)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(quote => {
                this.paymentPlans = quote.paymentPlans;
                this.savingPrice = quote.savings;
            });
    }
    findViewport(res) {
        const breakPoints = res.breakpoints;
        if (breakPoints['(min-width: 992px)']) {
            this.renderAllPlans(this.paymentPlans.desktop);
        } else if (breakPoints['(min-width: 768px)']) {
            this.renderAllPlans(this.paymentPlans.tablet);
        } else {
            this.renderAllPlans(this.paymentPlans.mobile);
        }
    }
    renderAllPlans(viewPlan) {
        viewPlan.sort(this.compare);
        console.log('view plan after sorting- --', viewPlan);
        const mediumPlans = [];
        const smallPlans = [];
        viewPlan.forEach(plan => {
            if (plan.displaySize === 'large' || plan.displaySize === 'medium') {
                mediumPlans.push(plan);
            } else {
                smallPlans.push(plan);
            }
        });
        this.renderMediumPlans = mediumPlans;
        this.renderSmallPlans = smallPlans;
        if (this.renderSmallPlans.length > 0) {
            this.additionalFlag = true;
        }
    }
    compare(a, b) {
        const bandA = a.displayOrder;
        const bandB = b.displayOrder;
        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }

    ngOnInit() {}
    toggleOption(event) {
        this.renderSmallPlans.filter(p => p.planId === event)[0].displaySize = 'medium';
    }
    scrollTo(className: string) {
        const elementList = document.querySelectorAll('.' + className);
        const element = elementList[0] as HTMLElement;
        element.scrollIntoView({ behavior: 'smooth' });
    }
    doContinue(event) {
        this.selectedPlan.emit(event);
    }
    ngOnDestroy(): void {
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }
}
