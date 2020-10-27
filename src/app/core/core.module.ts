import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { WebcamModule } from 'ngx-webcam';
import { VertiMaterialModule } from '../shared/verti-material.module';
import { AddDriverComponent } from '../lead/add-driver/add-driver.component';
import { AddressComponent } from '../lead/address/address.component';
import { ContactInfoComponent } from '../lead/contact-info/contact-info.component';
import { ContactpaComponent } from '../lead/contact-pa/contact-pa.component';
import { DefaultReviewComponent } from '../lead/default-review/default-review.component';
import { DriverDrivingHistoryComponent } from '../lead/driver-driving-history/driver-driving-history.component';
import { DriverLicenseStatusComponent } from '../lead/driver-license-status/driver-license-status.component';
import { DriverMajorViolationsComponent } from '../lead/driver-major-violations/driver-major-violations.component';
import { DriverMaritalStatusComponent } from '../lead/driver-marital-status/driver-marital-status.component';
import { DriverSummaryComponent } from '../lead/driver-summary/driver-summary.component';
import { FinalPriceComponent } from '../lead/final-price/final-price.component';
import { KoDeclineComponent } from '../lead/ko-decline/ko-decline.component';
import { KoQuestionOneComponent } from '../lead/ko-question-one/ko-question-one.component';
import { KoQuestionThreeComponent } from '../lead/ko-question-three/ko-question-three.component';
import { KoQuestionTwoComponent } from '../lead/ko-question-two/ko-question-two.component';
import { LicenseInfoComponent } from '../lead/license-info/license-info.component';
import { MinorViolationQuestionsComponent } from '../lead/minor-violation-questions/minor-violation-questions.component';
import { PniInfoComponent } from '../lead/pni-info/pni-info.component';
import { PNINameComponent } from '../lead/pni-name/pni-name.component';
import { PniPhoneComponent } from '../lead/pni-phone/pni-phone.component';
import { PniRelationshipComponent } from '../lead/pni-relationship/pni-relationship.component';
import { PolicyStartDateComponent } from '../lead/policy-start-date/policy-start-date.component';
import { PriceChangeComponent } from '../lead/price-change/price-change.component';
import { PriorAddressComponent } from '../lead/prior-address/prior-address.component';
import { ProductNotFoundComponent } from '../lead/product-not-found/product-not-found.component';
import { QuickquoteComponent } from '../lead/quickquote/quickquote.component';
import { QuotesFoundComponent } from '../lead/quotes-found/quotes-found.component';
import { RcDeclineComponent } from '../lead/rc-decline/rc-decline.component';
import { RecoverQuoteComponent } from '../lead/recover-quote/recover-quote.component';
import { SniContactInfoComponent } from '../lead/sni-contact-info/sni-contact-info.component';
import { SniSelectComponent } from '../lead/sni-select/sni-select.component';
import { SystemFailureComponent } from '../lead/system-failure/system-failure.component';
import { TitleHolderNotificationComponent } from '../lead/title-holder-notification/title-holder-notification.component';
import { TitleHolderSelectComponent } from '../lead/title-holder-select/title-holder-select.component';
import { VehicleComponent } from '../lead/vehicle-add/vehicle.component';
import { VehicleDamageComponent } from '../lead/vehicle-damage/vehicle-damage.component';
import { VehicleSummaryComponent } from '../lead/vehicle-summary/vehicle-summary.component';
import { VINComponent } from '../lead/vin/vin.component';
import { SignFormsComponent } from '../lead/sign-forms/sign-forms.component';
import { CallToCustomizeComponent } from '../lead/call-to-customize/call-to-customize.component';

import { DiscountSavingModalComponent } from '../shared/discount-saving-modal/discount-saving-modal.component';
import { ReviewAllDetailsModalComponent } from '../shared/review-all-details-modal/review-all-details-modal.component';
import { SharedModule } from '../shared/shared.module';
import { TimeoutModalComponent } from '../shared/timeout-modal/timeout-modal.component';

import { LeadEffects } from '../store/effects/lead.effects';
import { RouteEffect } from '../store/effects/route.effects';
import { metaReducers, reducers } from '../store/reducers';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MilestonesAndBackbtnComponent } from './milestones-and-backbtn/milestones-and-backbtn.component';
import { AppInitService } from './services/app-init.service';
import { HttpLogInterceptorService } from './services/http-log-interceptor.service';
import { WalmericDialogModalComponent } from './walmeric-dialog-modal/walmeric-dialog-modal.component';
import { PaymentConfirmationComponent } from '../lead/payment-confirmation/payment-confirmation.component';
import { PaymentFailedComponent } from '../lead/payment-failed/payment-failed.component';
import { MailingAddressComponent } from '../lead/mailing-address/mailing-address.component';
import { BillingAddressComponent } from '../lead/billing-address/billing-address.component';
import { PayerComponent } from '../lead/payer/payer.component';
import { VehicleAdditionalInfoComponent } from '../lead/vehicle-additional-info/vehicle-additional-info.component';

import { NonadpfCtaComponent } from '../lead/nonadpf-cta/nonadpf-cta.component';

import { DocVerifyComponent } from '../lead/doc-verify/doc-verify.component';
import { UploadFileComponent } from '../lead/upload-file/upload-file.component';
import { EvoPaymentComponent } from '../lead/evo-payment/evo-payment.component';
import { CreditCardComponent } from '../shared/credit-card/credit-card.component';
import { SpouseDPAlertModalComponent } from '../shared/spouse-dp-alert-modal/spouse-dp-alert-modal.component';

import { InsuranceCoverageComponent } from '../lead/insurance-coverage/insurance-coverage.component';
import { TellUsBitMoreComponent } from '../lead/tell-us-bit-more/tell-us-bit-more.component';
import { LastTimeCarInsuranceComponent } from '../lead/last-time-car-insurance/last-time-car-insurance.component';
import { CanDeactivateGuard } from './guards/candeactivate.guard';
import { PageLeavingAlertModalComponent } from '../shared/page-leaving-alert-modal/page-leaving-alert-modal.component';
import { CoveragesPageAlertModalComponent } from '../shared/coverages-page-alert-modal/coverages-page-alert-modal.component';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
import { PersonalDataAlertComponent } from '../lead/personal-data-alert/personal-data-alert.component';
import { CalltofinishComponent } from '../lead/calltofinish/calltofinish.component';
import { TranslateModule } from '@ngx-translate/core';

// import { MonthlyPaymentCardComponent } from '../lead/monthly-payment-card/monthly-payment-card.component';
import { MonthlyPaymentComponent } from '../lead/monthly-payment/monthly-payment.component';

import { SmallPaymentComponent } from '../lead/small-payment/small-payment.component';
import { MediumPaymentComponent } from '../lead/medium-payment/medium-payment.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        SharedModule,
        HttpClientModule,
        VertiMaterialModule,
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreDevtoolsModule.instrument({
            maxAge: 10
        }),
        EffectsModule.forRoot([RouteEffect, LeadEffects]),
        ZXingScannerModule,
        WebcamModule,
        DeviceDetectorModule.forRoot(),
        NgCircleProgressModule.forRoot({
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: '#78C000',
            innerStrokeColor: '#C7E596',
            animationDuration: 300
        }),
        TranslateModule
    ],
    exports: [HeaderComponent, FooterComponent, MilestonesAndBackbtnComponent, VertiMaterialModule],
    declarations: [
        HeaderComponent,
        FooterComponent,
        WalmericDialogModalComponent,
        ProductNotFoundComponent,
        PniInfoComponent,
        PNINameComponent,
        PersonalDataAlertComponent,
        PriorAddressComponent,
        ContactInfoComponent,
        KoQuestionOneComponent,
        KoQuestionTwoComponent,
        KoQuestionThreeComponent,
        AddDriverComponent,
        AddressComponent,
        MinorViolationQuestionsComponent,
        WalmericDialogModalComponent,
        VehicleSummaryComponent,
        DriverSummaryComponent,
        DriverMajorViolationsComponent,
        DriverLicenseStatusComponent,
        DriverMaritalStatusComponent,
        DriverDrivingHistoryComponent,
        VehicleComponent,
        ContactpaComponent,
        QuickquoteComponent,
        KoDeclineComponent,
        RcDeclineComponent,
        SystemFailureComponent,
        AddDriverComponent,
        DriverMaritalStatusComponent,
        MilestonesAndBackbtnComponent,
        SniSelectComponent,
        SniContactInfoComponent,
        RecoverQuoteComponent,
        QuotesFoundComponent,
        PolicyStartDateComponent,
        VehicleDamageComponent,
        TitleHolderSelectComponent,
        TitleHolderNotificationComponent,
        DefaultReviewComponent,
        VINComponent,
        LicenseInfoComponent,
        FinalPriceComponent,
        DiscountSavingModalComponent,
        PriceChangeComponent,
        PniRelationshipComponent,
        ReviewAllDetailsModalComponent,
        PniPhoneComponent,
        PaymentConfirmationComponent,
        PaymentFailedComponent,
        PniPhoneComponent,
        MailingAddressComponent,
        BillingAddressComponent,
        PayerComponent,
        SignFormsComponent,
        CallToCustomizeComponent,
        NonadpfCtaComponent,
        DocVerifyComponent,
        UploadFileComponent,
        EvoPaymentComponent,
        CreditCardComponent,
        SpouseDPAlertModalComponent,
        InsuranceCoverageComponent,
        TellUsBitMoreComponent,
        LastTimeCarInsuranceComponent,
        PageLeavingAlertModalComponent,
        CoveragesPageAlertModalComponent,
        SnackbarComponent,
        MonthlyPaymentComponent,
        // MonthlyPaymentCardComponent,
        MediumPaymentComponent,
        SmallPaymentComponent,
        CalltofinishComponent,
        VehicleAdditionalInfoComponent
    ],
    entryComponents: [
        PniInfoComponent,
        PNINameComponent,
        PersonalDataAlertComponent,
        PriorAddressComponent,
        ContactInfoComponent,
        KoQuestionOneComponent,
        KoQuestionTwoComponent,
        KoQuestionThreeComponent,
        AddressComponent,
        MinorViolationQuestionsComponent,
        WalmericDialogModalComponent,
        VehicleSummaryComponent,
        DriverSummaryComponent,
        VehicleComponent,
        QuickquoteComponent,
        TimeoutModalComponent,
        AddDriverComponent,
        DriverMaritalStatusComponent,
        DriverMajorViolationsComponent,
        DriverLicenseStatusComponent,
        DriverDrivingHistoryComponent,
        SniSelectComponent,
        SniContactInfoComponent,
        RecoverQuoteComponent,
        QuotesFoundComponent,
        PolicyStartDateComponent,
        VehicleDamageComponent,
        TitleHolderSelectComponent,
        TitleHolderNotificationComponent,
        DefaultReviewComponent,
        VINComponent,
        LicenseInfoComponent,
        PniRelationshipComponent,
        PriceChangeComponent,
        FinalPriceComponent,
        DiscountSavingModalComponent,
        ReviewAllDetailsModalComponent,
        PniPhoneComponent,
        PaymentConfirmationComponent,
        MailingAddressComponent,
        BillingAddressComponent,
        PayerComponent,
        PniPhoneComponent,
        SignFormsComponent,
        CallToCustomizeComponent,
        EvoPaymentComponent,
        DocVerifyComponent,
        UploadFileComponent,
        SpouseDPAlertModalComponent,
        InsuranceCoverageComponent,
        PageLeavingAlertModalComponent,
        CoveragesPageAlertModalComponent,
        SnackbarComponent,
        MonthlyPaymentComponent,
        // MonthlyPaymentCardComponent,
        MediumPaymentComponent,
        SmallPaymentComponent,
        SnackbarComponent,
        CalltofinishComponent,
        VehicleAdditionalInfoComponent
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (config: AppInitService) => () => config.fetchRoutes(),
            deps: [AppInitService],
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpLogInterceptorService,
            multi: true
        },
        CanDeactivateGuard
    ]
})
export class CoreModule {}
