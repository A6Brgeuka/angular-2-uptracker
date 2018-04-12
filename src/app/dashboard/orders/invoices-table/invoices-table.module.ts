import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { InvoicesTableComponent } from './invoices-table.component';
import { INVOICES_PROVIDERS } from './services/index';
import { AllInvoicesListModule } from './all-invoices-list/all-invoices-list.module';

@NgModule({
  declarations: [
    InvoicesTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllInvoicesListModule,
  ],
  providers: [
    INVOICES_PROVIDERS,
  ]
})
export class InvoicesTableModule {
}
