import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { AppSharedModule } from '../shared/shared.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
// import { UpdatePasswordModule } from './update-password/update-password.module';
import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    AppSharedModule,
    
    ForgotPasswordModule,
    // UpdatePasswordModule,
    LoginModule
  ],
  providers: []
})
export class AuthModule {
}