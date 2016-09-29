import { NgModule } from '@angular/core';

import { ForgotPasswordCongratsComponent } from './forgot-password-congrats.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ForgotPasswordCongratsComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class ForgotPasswordCongratsModule {
}