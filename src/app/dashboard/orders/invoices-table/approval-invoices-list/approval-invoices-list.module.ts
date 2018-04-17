import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { ApprovalInvoicesListComponent } from './approval-invoices-list.component';

@NgModule({
  declarations: [
    ApprovalInvoicesListComponent,
  ],
  exports: [ApprovalInvoicesListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class ApprovalInvoicesListModule {

}
