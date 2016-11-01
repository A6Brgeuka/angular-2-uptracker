import { NgModule } from '@angular/core';

import { OnboardComponent } from './onboard.component';
import { AppSharedModule } from '../shared/shared.module';
import { OnboardLocationsModule } from './locations/locations.module';
import { OnboardUsersModule } from './users/users.module';
import { AccountingModule } from './accounting/accounting.module';

@NgModule({
  declarations: [
    OnboardComponent,
  ],
  imports: [
    AppSharedModule,

    OnboardLocationsModule,
    OnboardUsersModule,
    AccountingModule
  ],
  providers: []
})
export class OnboardModule {
}