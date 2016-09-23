import { NgModule } from '@angular/core';

import { OnboardComponent } from './onboard.component';
import { AppSharedModule } from '../shared/shared.module';
import { LocationsModule } from './locations/locations.module';
// import { ResetPasswordModule } from './reset-password/reset-password.module';
// import { LoginModule } from './login/login.module';
// import { SignupModule } from './signup/signup.module';

@NgModule({
  declarations: [
    OnboardComponent,
  ],
  imports: [
    AppSharedModule,
    
    LocationsModule,
    // ResetPasswordModule,
    // LoginModule,
    // SignupModule
  ],
  providers: []
})
export class OnboardModule {
}