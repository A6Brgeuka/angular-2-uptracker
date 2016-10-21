import { NgModule } from '@angular/core';

import { AccountingComponent } from './accounting.component';
// import { LOCATIONS_RESOLVER_PROVIDERS } from './locations-resolve.service';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AccountingComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [
      // ...LOCATIONS_RESOLVER_PROVIDERS
  ]
})
export class AccountingModule {
}