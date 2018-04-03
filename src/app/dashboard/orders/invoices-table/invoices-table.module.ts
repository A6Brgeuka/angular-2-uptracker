import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { InvoicesTableComponent } from './invoices-table.component';

@NgModule({
  declarations: [
    InvoicesTableComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [
    // ORDER_PROVIDERS
  ]
})
export class InvoicesTableModule {
}
