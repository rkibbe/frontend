import { Route } from '@angular/router';
import { AddDriverComponent } from '@app/lead/add-driver/add-driver.component';
import { AddressComponent } from '@app/lead/address/address.component';
import { ContactInfoComponent } from '@app/lead/contact-info/contact-info.component';
import { DefaultReviewComponent } from '@app/lead/default-review/default-review.component';
import { DriverDrivingHistoryComponent } from '@app/lead/driver-driving-history/driver-driving-history.component';
import { DriverLicenseStatusComponent } from '@app/lead/driver-license-status/driver-license-status.component';
import { DriverMajorViolationsComponent } from '@app/lead/driver-major-violations/driver-major-violations.component';
import { DriverMaritalStatusComponent } from '@app/lead/driver-marital-status/driver-marital-status.component';
import { DriverSummaryComponent } from '@app/lead/driver-summary/driver-summary.component';
import { FinalPriceComponent } from '@app/lead/final-price/final-price.component';
import { KoQuestionOneComponent } from '@app/lead/ko-question-one/ko-question-one.component';
import { KoQuestionThreeComponent } from '@app/lead/ko-question-three/ko-question-three.component';
import { KoQuestionTwoComponent } from '@app/lead/ko-question-two/ko-question-two.component';
import { LicenseInfoComponent } from '@app/lead/license-info/license-info.component';
import { MinorViolationQuestionsComponent } from '@app/lead/minor-violation-questions/minor-violation-questions.component';
import { PniInfoComponent } from '@app/lead/pni-info/pni-info.component';
import { PNINameComponent } from '@app/lead/pni-name/pni-name.component';
import { PniPhoneComponent } from '@app/lead/pni-phone/pni-phone.component';
import { PniRelationshipComponent } from '@app/lead/pni-relationship/pni-relationship.component';
import { PolicyStartDateComponent } from '@app/lead/policy-start-date/policy-start-date.component';
import { PriceChangeComponent } from '@app/lead/price-change/price-change.component';
import { PriorAddressComponent } from '@app/lead/prior-address/prior-address.component';
import { QuickquoteComponent } from '@app/lead/quickquote/quickquote.component';
import { SniContactInfoComponent } from '@app/lead/sni-contact-info/sni-contact-info.component';
import { SniSelectComponent } from '@app/lead/sni-select/sni-select.component';
import { TitleHolderNotificationComponent } from '@app/lead/title-holder-notification/title-holder-notification.component';
import { TitleHolderSelectComponent } from '@app/lead/title-holder-select/title-holder-select.component';
import { VehicleComponent } from '@app/lead/vehicle-add/vehicle.component';
import { VehicleDamageComponent } from '@app/lead/vehicle-damage/vehicle-damage.component';
import { VehicleSummaryComponent } from '@app/lead/vehicle-summary/vehicle-summary.component';
import { VINComponent } from '@app/lead/vin/vin.component';
import { SignFormsComponent } from '@app/lead/sign-forms/sign-forms.component';
import { MailingAddressComponent } from '@app/lead/mailing-address/mailing-address.component';
import { BillingAddressComponent } from '@app/lead/billing-address/billing-address.component';
import { DocVerifyComponent } from '@app/lead/doc-verify/doc-verify.component';
import { UploadFileComponent } from '@app/lead/upload-file/upload-file.component';
import { PayerComponent } from '@app/lead/payer/payer.component';
import { EvoPaymentComponent } from '@app/lead/evo-payment/evo-payment.component';
import { PaymentConfirmationComponent } from '@app/lead/payment-confirmation/payment-confirmation.component';
import { PaymentStatusComponent } from '@app/lead/payment-status/payment-status.component';
import { PaymentSuccessComponent } from '@app/lead/payment-success/payment-success.component';
import { InsuranceCoverageComponent } from '@app/lead/insurance-coverage/insurance-coverage.component';
import { CanDeactivateGuard } from './guards/candeactivate.guard';
import { LeadLandingComponent } from '@app/lead/lead-landing/lead-landing.component';
import { VehicleAdditionalInfoComponent } from '@app/lead/vehicle-additional-info/vehicle-additional-info.component';
export const RouteMap: { [key: string]: Route } = {
    leadlanding: { path: 'leadlanding', component: LeadLandingComponent },
    basicinfo: { path: 'basicinfo', component: PNINameComponent },
    maritalstatus: { path: 'maritalstatus', component: PniInfoComponent },
    homeaddress: { path: 'homeaddress', component: AddressComponent },
    previousaddress: { path: 'previousaddress', component: PriorAddressComponent },
    contactinfo: { path: 'contactinfo', component: ContactInfoComponent },
    eligibilityquestionone: { path: 'eligibilityquestionone', component: KoQuestionOneComponent },
    eligibilityquestiontwo: { path: 'eligibilityquestiontwo', component: KoQuestionTwoComponent },
    eligibilityquestionthree: { path: 'eligibilityquestionthree', component: KoQuestionThreeComponent },
    drivinghistory: { path: 'drivinghistory', component: MinorViolationQuestionsComponent },
    driversummary: { path: 'driversummary', component: DriverSummaryComponent },
    vehiclesummary: { path: 'vehiclesummary', component: VehicleSummaryComponent },
    'driverbasicinfo/:id': { path: 'driverbasicinfo/:id', component: AddDriverComponent },
    'drivermaritalstatus/:id': { path: 'drivermaritalstatus/:id', component: DriverMaritalStatusComponent },
    'drivermajorviolation/:id': { path: 'drivermajorviolation/:id', component: DriverMajorViolationsComponent },
    'licensesuspended/:id': { path: 'licensesuspended/:id', component: DriverLicenseStatusComponent },
    'driverdrivinghistory/:id': { path: 'driverdrivinghistory/:id', component: DriverDrivingHistoryComponent },
    'vehicleadd/:id': { path: 'vehicleadd/:id', component: VehicleComponent },
    quickquote: { path: 'quickquote', component: QuickquoteComponent },
    'relationship/:id': { path: 'relationship/:id', component: PniRelationshipComponent },
    'licenseinfoprerc/:id': { path: 'licenseinfoprerc/:id', component: LicenseInfoComponent },
    'licenseinfopostrc/:id': { path: 'licenseinfopostrc/:id', component: LicenseInfoComponent },
    sni: { path: 'sni', component: SniSelectComponent },
    'snicontact/:id': { path: 'snicontact/:id', component: SniContactInfoComponent },
    'vin/:id': { path: 'vin/:id', component: VINComponent },
    vehicledamage: { path: 'vehicledamage', component: VehicleDamageComponent },
    'titleholder-select/:id': { path: 'titleholder-select/:id', component: TitleHolderSelectComponent },
    'titleholder-contact/:id': { path: 'titleholder-contact/:id', component: TitleHolderNotificationComponent },
    policystartdate: { path: 'policystartdate', component: PolicyStartDateComponent },
    phone: { path: 'phone', component: PniPhoneComponent },
    policyreview: { path: 'policyreview', component: DefaultReviewComponent, canDeactivate: [CanDeactivateGuard] },
    pricechange: { path: 'pricechange', component: PriceChangeComponent },
    finalprice: { path: 'finalprice', component: FinalPriceComponent },
    signforms: { path: 'signforms', component: SignFormsComponent },
    mailingaddress: { path: 'mailingaddress', component: MailingAddressComponent },
    payer: { path: 'payer', component: PayerComponent },
    billingaddress: { path: 'billingaddress', component: BillingAddressComponent },
    docverify: { path: 'docverify', component: DocVerifyComponent },
    'uploadfile/:id': { path: 'uploadfile/:id', component: UploadFileComponent },
    pay: { path: 'pay', component: EvoPaymentComponent },
    paymentstatus: { path: 'paymentstatus', component: PaymentStatusComponent },
    paymentconfirm: { path: 'paymentconfirm', component: PaymentConfirmationComponent },
    paymentsuccess: { path: 'paymentsuccess', component: PaymentSuccessComponent },
    insurancecoverage: { path: 'insurancecoverage', component: InsuranceCoverageComponent },
    'vehicleaddnlinfo/:id': { path: 'vehicleaddnlinfo/:id', component: VehicleAdditionalInfoComponent }
};
