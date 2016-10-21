import { NgModule } from '@angular/core';

import { OnboardComponent } from './onboard.component';
import { AppSharedModule } from '../shared/shared.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { AccountingModule } from './accounting/accounting.module';

@NgModule({
  declarations: [
    OnboardComponent,
  ],
  imports: [
    AppSharedModule,
    
    LocationsModule,
    UsersModule,
    AccountingModule
  ],
  providers: []
})
export class OnboardModule {
}