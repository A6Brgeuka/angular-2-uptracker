import { NgModule } from '@angular/core';

import { AccountingComponent } from './accounting.component';
import { ACCOUNTING_RESOLVER_PROVIDERS } from './accounting-resolve.service';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AccountingComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [
      ...ACCOUNTING_RESOLVER_PROVIDERS
  ]
})
export class AccountingModule {
}