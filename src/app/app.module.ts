import { APP_BASE_HREF, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { TypeListService, TypeListServiceImpl } from './core/services/type-list.service';
import { CustomHashLocationStrategy } from './custom-hash-location-strategy';
import { SharedModule } from './shared/shared.module';

import { TokenConfirmComponent } from './lead/token-confirm/token-confirm.component';
import { PaymentStatusComponent } from './lead/payment-status/payment-status.component';
import { PaymentSuccessComponent } from './lead/payment-success/payment-success.component';
import { AppSettings } from './shared/settings/app-settings';
import { ContactUsComponent } from './lead/contact-us/contact-us.component';
import { LeadLandingComponent } from './lead/lead-landing/lead-landing.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        TokenConfirmComponent,
        PaymentStatusComponent,
        PaymentSuccessComponent,
        ContactUsComponent,
        LeadLandingComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        AppSettings,
        { provide: LocationStrategy, useClass: CustomHashLocationStrategy },
        { provide: TypeListService, useClass: TypeListServiceImpl }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
