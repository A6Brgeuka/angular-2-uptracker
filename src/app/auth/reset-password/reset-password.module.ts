import { NgModule } from '@angular/core';

import { ResetPasswordComponent } from './reset-password.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class ResetPasswordModule {
}