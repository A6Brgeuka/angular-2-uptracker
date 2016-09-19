import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class LoginModule {
}