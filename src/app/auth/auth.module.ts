import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { AppSharedModule } from '../shared/shared.module';
import { LoginModule } from './login/login.module';

import { EmailVerificationModule } from './email-verification/email-verification.module';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    AppSharedModule,
    
    // ForgotPasswordModule,
    // ResetPasswordModule,
    // LoginModule,
    // SignupModule,
    // ForgotPasswordCongratsModule,
    EmailVerificationModule
  ],
  providers: []
})
export class AuthModule {
}