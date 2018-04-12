import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { InvoicesTableComponent } from './invoices-table.component';
import { INVOICES_PROVIDERS } from './services/index';
import { AllInvoicesListModule } from './all-invoices-list/all-invoices-list.module';
import { OpenInvoicesListModule } from './open-invoices-list/open-invoices-list.module';

@NgModule({
  declarations: [
    InvoicesTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllInvoicesListModule,
    OpenInvoicesListModule,
  ],
  providers: [
    INVOICES_PROVIDERS,
  ]
})
export class InvoicesTableModule {
}
