import { NgModule } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class ForgotPasswordModule {
}