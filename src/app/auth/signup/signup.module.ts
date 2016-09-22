import { NgModule } from '@angular/core';

import { SignupComponent } from './signup.component';
import { AppSharedModule } from '../../shared/shared.module';
import { AboutCompanyModule } from './about-company/about-company.module';
import { CreateAccountModule } from './create-account/create-account.module';
import { PaymentInfoModule } from './payment-info/payment-info.module';
import { CongratsModule } from './congrats/congrats.module';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    AppSharedModule,

    AboutCompanyModule,
    CreateAccountModule,
    PaymentInfoModule,
    CongratsModule
  ],
  providers: []
})
export class SignupModule {
}