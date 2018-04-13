import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { InvoicesTableComponent } from './invoices-table.component';
import { INVOICES_PROVIDERS } from './services/index';
import { ApprovalInvoicesListModule } from './approval-invoices-list/approval-invoices-list.module';
import { AllInvoicesListModule } from './all-invoices-list/all-invoices-list.module';
import { OpenInvoicesListModule } from './open-invoices-list/open-invoices-list.module';
import { PaymentInvoicesListModule } from './payment-invoices-list/payment-invoices-list.module';
import { PaidInvoicesListModule } from './paid-invoices-list/paid-invoices-list.module';
import { FlaggedInvoicesListModule } from './flagged-invoices-list/flagged-invoices-list.module';

@NgModule({
  declarations: [
    InvoicesTableComponent,
  ],
  imports: [
    AppSharedModule,
    ApprovalInvoicesListModule,
    AllInvoicesListModule,
    FlaggedInvoicesListModule,
    OpenInvoicesListModule,
    PaymentInvoicesListModule,
    PaidInvoicesListModule,
  ],
  providers: [
    INVOICES_PROVIDERS,
  ]
})
export class InvoicesTableModule {
}
