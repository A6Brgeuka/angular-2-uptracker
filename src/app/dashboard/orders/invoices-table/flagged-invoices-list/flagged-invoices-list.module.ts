import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { FlaggedInvoicesListComponent } from './flagged-invoices-list.component';

@NgModule({
  declarations: [
    FlaggedInvoicesListComponent,
  ],
  exports: [FlaggedInvoicesListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class FlaggedInvoicesListModule {

}
