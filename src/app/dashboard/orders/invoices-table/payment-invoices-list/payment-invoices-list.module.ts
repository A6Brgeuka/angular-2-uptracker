import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { PaymentInvoicesListComponent } from './payment-invoices-list.component';

@NgModule({
  declarations: [
    PaymentInvoicesListComponent,
  ],
  exports: [PaymentInvoicesListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class PaymentInvoicesListModule {

}
