import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KoDeclineComponent } from './lead/ko-decline/ko-decline.component';
import { ProductNotFoundComponent } from './lead/product-not-found/product-not-found.component';
import { QuotesFoundComponent } from './lead/quotes-found/quotes-found.component';
import { RcDeclineComponent } from './lead/rc-decline/rc-decline.component';
import { RecoverQuoteComponent } from './lead/recover-quote/recover-quote.component';

import { SystemFailureComponent } from './lead/system-failure/system-failure.component';
import { PaymentConfirmationComponent } from './lead/payment-confirmation/payment-confirmation.component';
import { PaymentFailedComponent } from './lead/payment-failed/payment-failed.component';

import { CallToCustomizeComponent } from './lead/call-to-customize/call-to-customize.component';

import { NonadpfCtaComponent } from './lead/nonadpf-cta/nonadpf-cta.component';

import { PaymentStatusComponent } from './lead/payment-status/payment-status.component';
import { TokenConfirmComponent } from './lead/token-confirm/token-confirm.component';
import { PaymentSuccessComponent } from './lead/payment-success/payment-success.component';
import { PersonalDataAlertComponent } from './lead/personal-data-alert/personal-data-alert.component';
import { ContactUsComponent } from './lead/contact-us/contact-us.component';
import { LeadLandingComponent } from './lead/lead-landing/lead-landing.component';

const routes: Routes = [
    { path: 'notinyourarea', component: ProductNotFoundComponent },
    { path: 'kodecline', component: KoDeclineComponent },
    { path: 'rcdecline', component: RcDeclineComponent },
    { path: 'systemfailure', component: SystemFailureComponent },
    { path: 'recoverquote', component: RecoverQuoteComponent },
    { path: 'quotes', component: QuotesFoundComponent },
    { path: 'callcustomize', component: CallToCustomizeComponent },
    { path: 'nonadpfcta', component: NonadpfCtaComponent },
    { path: 'paymentstatus', component: PaymentStatusComponent },
    { path: 'tokenconfirm', component: TokenConfirmComponent },
    { path: 'paymentconfirm', component: PaymentConfirmationComponent },
    { path: 'paymentsuccess', component: PaymentSuccessComponent },
    { path: 'paymentfail', component: PaymentFailedComponent },
    { path: 'personaldataalert', component: PersonalDataAlertComponent },
    { path: 'contactus', component: ContactUsComponent },
    { path: 'leadlanding', component: LeadLandingComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
