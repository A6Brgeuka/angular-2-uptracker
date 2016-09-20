import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { AppSharedModule } from '../shared/shared.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    AppSharedModule,
    
    ForgotPasswordModule,
    ResetPasswordModule,
    LoginModule
  ],
  providers: []
})
export class AuthModule {
}