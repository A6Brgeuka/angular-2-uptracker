import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { AllInvoicesListComponent } from './all-invoices-list.component';

@NgModule({
  declarations: [
    AllInvoicesListComponent,
  ],
  exports: [AllInvoicesListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class AllInvoicesListModule {

}
