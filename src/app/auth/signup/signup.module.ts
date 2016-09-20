import { NgModule } from '@angular/core';

import { SignupComponent } from './signup.component';
import { AppSharedModule } from '../../shared/shared.module';
import { AboutCompanyModule } from './about-company/about-company.module';
// import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
// import { ResetPasswordModule } from './reset-password/reset-password.module';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    AppSharedModule,

    AboutCompanyModule,
    // ForgotPasswordModule,
    // ResetPasswordModule
  ],
  providers: []
})
export class SignupModule {
}