import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VertiMaterialModule } from './verti-material.module';
import { CardComponent } from './card/card.component';
import { PageImageTitleComponent } from './page-image-title/page-image-title.component';
import { KoQuestionsListsComponent } from './ko-questions-lists/ko-questions-lists.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { TrilliumModalComponent } from './trillium-modal/trillium-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserMaritalStatusComponent } from './user-marital-status/user-marital-status.component';
import { ErrorDialogModalComponent } from './error-dialog-modal/error-dialog-modal.component';
import { TimeoutModalComponent } from './timeout-modal/timeout-modal.component';
import { InputMaskDirective } from './directives/input-mask.directive';
import { RecoverQuoteNotFoundModalComponent } from './recover-quote-not-found-modal/recover-quote-not-found-modal.component';
import { RecoveredQuoteSummaryItemComponent } from './recovered-quote-summary-item/recovered-quote-summary-item.component';
import { NameInputDirective } from './directives/name-input.directive';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { VertiDigitDirective } from './directives/digitonly.directive';
import { ImageDescriptionGroupComponent } from './image-description-group/image-description-group.component';
import { TitleHolderModalComponent } from './title-holder-modal/title-holder-modal.component';
import { ExcludedDriverModalComponent } from './excluded-driver-modal/excluded-driver-modal.component';
import { IncludedDriverModalComponent } from './included-driver-modal/included-driver-modal.component';
import { ExistingDamageComponent } from './existing-damage/existing-damage.component';
import { VinInputDirective } from './directives/vin-input.directive';
import { ManualAddressComponent } from './manual-address/manual-address.component';
import { AutofillAddressComponent } from './autofill-address/autofill-address.component';
import { PdfGenerationModalComponent } from './pdf-generation-modal/pdf-generation-modal.component';

import { DateSuffix } from './pipes/datesuffix.pipe';
import { RouterModule } from '@angular/router';
import { AddressInputComponent } from './address-input/address-input.component';
import { AddressPipe } from './pipes/address.pipe';
import { BigPriceComponent } from './big-price/big-price.component';
import { PaymentMethodModalComponent } from './payment-method-modal/payment-method-modal.component';

import { SentModalComponent } from './sent-modal/sent-modal.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { AddfileModalComponent } from './addfile-modal/addfile-modal.component';
import { ValidfileModalComponent } from './validfile-modal/validfile-modal.component';
import { AllowModalComponent } from './allow-modal/allow-modal.component';
import { CaptureModalComponent } from './capture-modal/capture-modal.component';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { PreviousBodilyInjuryModalComponent } from './previous-bodily-injury-modal/previous-bodily-injury-modal.component';

import { WebcamModule } from 'ngx-webcam';
import { OpportunityModalComponent } from './opportunity-modal/opportunity-modal.component';
import { DottedListItemComponent } from './dotted-list-item/dotted-list-item.component';
import { DiscountSavingsComponent } from './discount-savings/discount-savings.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        VertiMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        AngularSvgIconModule,
        WebcamModule,
        TranslateModule,
        RouterModule.forChild([])
    ],
    exports: [
        BrowserAnimationsModule,
        VertiMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        AngularSvgIconModule,
        CardComponent,
        PageImageTitleComponent,
        UserFormComponent,
        RecoveredQuoteSummaryItemComponent,
        UserMaritalStatusComponent,
        KoQuestionsListsComponent,
        BackButtonComponent,
        ProgressBarComponent,
        InputMaskDirective,
        NameInputDirective,
        VertiDigitDirective,
        ImageDescriptionGroupComponent,
        VinInputDirective,
        ManualAddressComponent,
        AutofillAddressComponent,
        DateSuffix,
        RouterModule,
        AddressInputComponent,
        AddressPipe,
        BigPriceComponent,
        DottedListItemComponent,
        DiscountSavingsComponent
    ],
    declarations: [
        CardComponent,
        PageImageTitleComponent,
        KoQuestionsListsComponent,
        BackButtonComponent,
        TrilliumModalComponent,
        ErrorModalComponent,
        RecoverQuoteNotFoundModalComponent,
        UserFormComponent,
        RecoveredQuoteSummaryItemComponent,
        UserMaritalStatusComponent,
        ErrorDialogModalComponent,
        TimeoutModalComponent,
        SentModalComponent,
        DeleteModalComponent,
        CancelModalComponent,
        AddfileModalComponent,
        ValidfileModalComponent,
        AllowModalComponent,
        CaptureModalComponent,
        InputMaskDirective,
        NameInputDirective,
        ProgressBarComponent,
        VertiDigitDirective,
        ImageDescriptionGroupComponent,
        TitleHolderModalComponent,
        ExcludedDriverModalComponent,
        IncludedDriverModalComponent,
        ExistingDamageComponent,
        VinInputDirective,
        ManualAddressComponent,
        AutofillAddressComponent,
        DateSuffix,
        AddressInputComponent,
        AddressPipe,
        PaymentMethodModalComponent,
        PdfGenerationModalComponent,
        BigPriceComponent,
        PreviousBodilyInjuryModalComponent,
        OpportunityModalComponent,
        DottedListItemComponent,
        DiscountSavingsComponent
        // EditPolicyCoverageComponent
    ],
    entryComponents: [
        TrilliumModalComponent,
        ErrorModalComponent,
        ErrorDialogModalComponent,
        TimeoutModalComponent,
        SentModalComponent,
        DeleteModalComponent,
        CancelModalComponent,
        AddfileModalComponent,
        ValidfileModalComponent,
        AllowModalComponent,
        CaptureModalComponent,
        RecoverQuoteNotFoundModalComponent,
        TitleHolderModalComponent,
        ExcludedDriverModalComponent,
        IncludedDriverModalComponent,
        ExistingDamageComponent,
        PaymentMethodModalComponent,
        ExistingDamageComponent,
        PdfGenerationModalComponent,
        PreviousBodilyInjuryModalComponent,
        OpportunityModalComponent
    ],
    providers: [AddressPipe]
})
export class SharedModule { }
