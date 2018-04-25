import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { PaidInvoicesListComponent } from './paid-invoices-list.component';

@NgModule({
  declarations: [
    PaidInvoicesListComponent,
  ],
  exports: [PaidInvoicesListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class PaidInvoicesListModule {

}
